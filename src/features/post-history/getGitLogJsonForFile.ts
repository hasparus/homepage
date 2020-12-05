// @ts-check

/* eslint-disable @typescript-eslint/no-use-before-define */
import { exec } from "child_process";
import fs from "fs";
import { promisify } from "util";

const exists = promisify(fs.exists);

const random = Math.random() * 10e8;
const LINE_DELIMTER = random.toString(36).trim();
const PARAM_DELIMITER = `-- ${random} --`;

const makeGitLogCommand = (params: string[], filepath = "") =>
  `git log --pretty=format:"${params.join(
    PARAM_DELIMITER
  )}${LINE_DELIMTER}" "${filepath}"`;

const prettyFormatPlaceholders = {
  commit: "%H",
  abbreviatedCommit: "%h",
  tree: "%T",
  abbreviatedTree: "%t",
  parent: "%P",
  abbreviatedParent: "%p",
  refs: "%D",
  encoding: "%e",
  subject: "%s",
  sanitizedSubjectLine: "%f",
  body: "%b",
  commitNotes: "%N",
  verificationFlag: "%G?",
  signer: "%GS",
  signerKey: "%GK",
  authorName: "%aN",
  authorEmail: "%aE",
  authorDate: "%aD",
  committerName: "%cN",
  committerEmail: "%cE",
  committerDate: "%cD",
};

type PrettyFormatPlaceholders = typeof prettyFormatPlaceholders;

/**
 * Adapted from https://gist.github.com/sergey-shpak/40fe8d2534c5e5941b9db9e28132ca0b
 *
 * @example
 * getGitLogJsonForFile("content/posts/refinement-types.mdx", [
 *   "abbreviatedCommit",
 *   "authorDate",
 *   "subject",
 *   "body",
 * ]).then(console.log);
 *
 * I think I can't do <T extends keyof PrettyFormatPlaceholders> here :(
 */
export const getGitLogJsonForFile = <
  T extends keyof PrettyFormatPlaceholders
>(
  filepath: string,
  fields: Array<T>
): Promise<Record<T, string>[]> =>
  exists(filepath).then((fileExists) => {
    if (!fileExists) {
      throw new Error(`${filepath} doesn't exist`);
    }

    return new Promise((resolve, reject) => {
      const params = fields.map((key) => prettyFormatPlaceholders[key]);

      const command = makeGitLogCommand(params, filepath);
      exec(command, { encoding: "utf-8" }, (err, stdout) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            stdout
              .trim()
              .split(LINE_DELIMTER)
              .filter((line) => line.length)
              .map((line) =>
                line
                  .trim()
                  .split(PARAM_DELIMITER)
                  .reduce((obj, value, idx) => {
                    // eslint-disable-next-line no-param-reassign
                    obj[fields[idx]!] = value.startsWith("\n")
                      ? value.slice(1)
                      : value;

                    return obj;
                  }, {} as Record<T, string>)
              )
          );
        }
      });
    });
  });
