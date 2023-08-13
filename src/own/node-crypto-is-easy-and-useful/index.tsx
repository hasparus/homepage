import { onMount } from "solid-js";

export function Demo() {
  let iframe!: HTMLIFrameElement;

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  onMount(async () => {
    const { Nodebox } = await import("@codesandbox/nodebox");

    const emulator = new Nodebox({
      iframe,
    });

    await emulator.connect();

    await emulator.fs.init({
      "main.js": `
      import * as assert from "node:assert";
      import {
        KeyObject,
        generateKeyPair,
        privateDecrypt,
        publicEncrypt,
        sign,
        verify,
      } from "node:crypto";
      // import { it } from "node:test";
      
      // const keypair = await new Promise((resolve, reject) => {
      //   generateKeyPair(
      //     "rsa",
      //     { modulusLength: 512 },
      //     (error, publicKey, privateKey) =>
      //       error ? reject(error) : resolve({ publicKey, privateKey })
      //   );
      // });
      
      // const { privateKey, publicKey } = keypair;

      // console.log(privateKey, publicKey)
      
      // const originalString = "banana bread";
      
      // const originalUint8Array = new Uint8Array(
      //   originalString.split("").map((ch) => ch.charCodeAt(0))
      // );
      
      // it("decrypted message is the same as encrypted", () => {
      //   const encryptedBuffer = publicEncrypt(publicKey, originalUint8Array);
      //   const decryptedBuffer = privateDecrypt(privateKey, encryptedBuffer);
      //   const decryptedString = decryptedBuffer.toString();
      
      //   assert.equal(originalString, decryptedString);
      // });
      
      // it("signed message is verified", () => {
      //   const signature = sign(null, originalUint8Array, privateKey);
      //   const verified = verify(null, originalUint8Array, publicKey, signature);
      
      //   assert.ok(verified);
      // });

        console.log('wow')
      
      `,
    });

    const shell = emulator.shell.create();
    shell.stdout.addListener("data", (data) => console.log(data));
    const command = await shell.runCommand("node", ["main.js"]);
    const { url } = await emulator.preview.getByShellId(command.id);
    const previewIframe = document.getElementById("nodebox-preview-iframe")!;
    previewIframe.setAttribute("src", url);
  });

  return (
    <iframe ref={iframe} title="nodebox iframe" id="nodebox-runtime-iframe" />
  );
}
