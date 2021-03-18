export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  /** The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID. */
  ID: string;
  /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
  String: string;
  /** The `Boolean` scalar type represents `true` or `false`. */
  Boolean: boolean;
  /** The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. */
  Int: number;
  /** The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). */
  Float: number;
  /**
   * A date string, such as 2007-12-03, compliant with the ISO 8601 standard for
   * representation of dates and times using the Gregorian calendar.
   */
  Date: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};











export type AvifOptions = {
  quality?: Maybe<Scalars['Int']>;
  lossless?: Maybe<Scalars['Boolean']>;
  speed?: Maybe<Scalars['Int']>;
};

export type BlogpostHistory = {
  entries: Array<BlogpostHistoryEntry>;
  url: Scalars['String'];
};

export type BlogpostHistoryEntry = {
  abbreviatedCommit?: Maybe<Scalars['String']>;
  authorDate: Scalars['Date'];
  subject?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
};

export type BlogpostHistoryEntryFilterInput = {
  abbreviatedCommit?: Maybe<StringQueryOperatorInput>;
  authorDate?: Maybe<DateQueryOperatorInput>;
  subject?: Maybe<StringQueryOperatorInput>;
  body?: Maybe<StringQueryOperatorInput>;
};

export type BlogpostHistoryEntryFilterListInput = {
  elemMatch?: Maybe<BlogpostHistoryEntryFilterInput>;
};

export type BlogpostHistoryFilterInput = {
  entries?: Maybe<BlogpostHistoryEntryFilterListInput>;
  url?: Maybe<StringQueryOperatorInput>;
};

export type BlogpostHistoryType = 
  | 'Verbose'
  | 'DatesOnly';

export type BlogpostHistoryTypeQueryOperatorInput = {
  eq?: Maybe<BlogpostHistoryType>;
  ne?: Maybe<BlogpostHistoryType>;
  in?: Maybe<Array<Maybe<BlogpostHistoryType>>>;
  nin?: Maybe<Array<Maybe<BlogpostHistoryType>>>;
};

export type BlurredOptions = {
  /** Width of the generated low-res preview. Default is 20px */
  width?: Maybe<Scalars['Int']>;
  /**
   * Force the output format for the low-res preview. Default is to use the same
   * format as the input. You should rarely need to change this
   */
  toFormat?: Maybe<ImageFormat>;
};

export type BooleanQueryOperatorInput = {
  eq?: Maybe<Scalars['Boolean']>;
  ne?: Maybe<Scalars['Boolean']>;
  in?: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  nin?: Maybe<Array<Maybe<Scalars['Boolean']>>>;
};


export type DateQueryOperatorInput = {
  eq?: Maybe<Scalars['Date']>;
  ne?: Maybe<Scalars['Date']>;
  gt?: Maybe<Scalars['Date']>;
  gte?: Maybe<Scalars['Date']>;
  lt?: Maybe<Scalars['Date']>;
  lte?: Maybe<Scalars['Date']>;
  in?: Maybe<Array<Maybe<Scalars['Date']>>>;
  nin?: Maybe<Array<Maybe<Scalars['Date']>>>;
};

export type Directory = Node & {
  sourceInstanceName: Scalars['String'];
  absolutePath: Scalars['String'];
  relativePath: Scalars['String'];
  extension: Scalars['String'];
  size: Scalars['Int'];
  prettySize: Scalars['String'];
  modifiedTime: Scalars['Date'];
  accessTime: Scalars['Date'];
  changeTime: Scalars['Date'];
  birthTime: Scalars['Date'];
  root: Scalars['String'];
  dir: Scalars['String'];
  base: Scalars['String'];
  ext: Scalars['String'];
  name: Scalars['String'];
  relativeDirectory: Scalars['String'];
  dev: Scalars['Int'];
  mode: Scalars['Int'];
  nlink: Scalars['Int'];
  uid: Scalars['Int'];
  gid: Scalars['Int'];
  rdev: Scalars['Int'];
  ino: Scalars['Float'];
  atimeMs: Scalars['Float'];
  mtimeMs: Scalars['Float'];
  ctimeMs: Scalars['Float'];
  atime: Scalars['Date'];
  mtime: Scalars['Date'];
  ctime: Scalars['Date'];
  /** @deprecated Use `birthTime` instead */
  birthtime?: Maybe<Scalars['Date']>;
  /** @deprecated Use `birthTime` instead */
  birthtimeMs?: Maybe<Scalars['Float']>;
  blksize?: Maybe<Scalars['Int']>;
  blocks?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  parent?: Maybe<Node>;
  children: Array<Node>;
  internal: Internal;
};


export type DirectoryModifiedTimeArgs = {
  formatString?: Maybe<Scalars['String']>;
  fromNow?: Maybe<Scalars['Boolean']>;
  difference?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
};


export type DirectoryAccessTimeArgs = {
  formatString?: Maybe<Scalars['String']>;
  fromNow?: Maybe<Scalars['Boolean']>;
  difference?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
};


export type DirectoryChangeTimeArgs = {
  formatString?: Maybe<Scalars['String']>;
  fromNow?: Maybe<Scalars['Boolean']>;
  difference?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
};


export type DirectoryBirthTimeArgs = {
  formatString?: Maybe<Scalars['String']>;
  fromNow?: Maybe<Scalars['Boolean']>;
  difference?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
};


export type DirectoryAtimeArgs = {
  formatString?: Maybe<Scalars['String']>;
  fromNow?: Maybe<Scalars['Boolean']>;
  difference?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
};


export type DirectoryMtimeArgs = {
  formatString?: Maybe<Scalars['String']>;
  fromNow?: Maybe<Scalars['Boolean']>;
  difference?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
};


export type DirectoryCtimeArgs = {
  formatString?: Maybe<Scalars['String']>;
  fromNow?: Maybe<Scalars['Boolean']>;
  difference?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
};

export type DirectoryConnection = {
  totalCount: Scalars['Int'];
  edges: Array<DirectoryEdge>;
  nodes: Array<Directory>;
  pageInfo: PageInfo;
  distinct: Array<Scalars['String']>;
  group: Array<DirectoryGroupConnection>;
};


export type DirectoryConnectionDistinctArgs = {
  field: DirectoryFieldsEnum;
};


export type DirectoryConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  field: DirectoryFieldsEnum;
};

export type DirectoryEdge = {
  next?: Maybe<Directory>;
  node: Directory;
  previous?: Maybe<Directory>;
};

export type DirectoryFieldsEnum = 
  | 'sourceInstanceName'
  | 'absolutePath'
  | 'relativePath'
  | 'extension'
  | 'size'
  | 'prettySize'
  | 'modifiedTime'
  | 'accessTime'
  | 'changeTime'
  | 'birthTime'
  | 'root'
  | 'dir'
  | 'base'
  | 'ext'
  | 'name'
  | 'relativeDirectory'
  | 'dev'
  | 'mode'
  | 'nlink'
  | 'uid'
  | 'gid'
  | 'rdev'
  | 'ino'
  | 'atimeMs'
  | 'mtimeMs'
  | 'ctimeMs'
  | 'atime'
  | 'mtime'
  | 'ctime'
  | 'birthtime'
  | 'birthtimeMs'
  | 'blksize'
  | 'blocks'
  | 'id'
  | 'parent___id'
  | 'parent___parent___id'
  | 'parent___parent___parent___id'
  | 'parent___parent___parent___children'
  | 'parent___parent___children'
  | 'parent___parent___children___id'
  | 'parent___parent___children___children'
  | 'parent___parent___internal___content'
  | 'parent___parent___internal___contentDigest'
  | 'parent___parent___internal___description'
  | 'parent___parent___internal___fieldOwners'
  | 'parent___parent___internal___ignoreType'
  | 'parent___parent___internal___mediaType'
  | 'parent___parent___internal___owner'
  | 'parent___parent___internal___type'
  | 'parent___children'
  | 'parent___children___id'
  | 'parent___children___parent___id'
  | 'parent___children___parent___children'
  | 'parent___children___children'
  | 'parent___children___children___id'
  | 'parent___children___children___children'
  | 'parent___children___internal___content'
  | 'parent___children___internal___contentDigest'
  | 'parent___children___internal___description'
  | 'parent___children___internal___fieldOwners'
  | 'parent___children___internal___ignoreType'
  | 'parent___children___internal___mediaType'
  | 'parent___children___internal___owner'
  | 'parent___children___internal___type'
  | 'parent___internal___content'
  | 'parent___internal___contentDigest'
  | 'parent___internal___description'
  | 'parent___internal___fieldOwners'
  | 'parent___internal___ignoreType'
  | 'parent___internal___mediaType'
  | 'parent___internal___owner'
  | 'parent___internal___type'
  | 'children'
  | 'children___id'
  | 'children___parent___id'
  | 'children___parent___parent___id'
  | 'children___parent___parent___children'
  | 'children___parent___children'
  | 'children___parent___children___id'
  | 'children___parent___children___children'
  | 'children___parent___internal___content'
  | 'children___parent___internal___contentDigest'
  | 'children___parent___internal___description'
  | 'children___parent___internal___fieldOwners'
  | 'children___parent___internal___ignoreType'
  | 'children___parent___internal___mediaType'
  | 'children___parent___internal___owner'
  | 'children___parent___internal___type'
  | 'children___children'
  | 'children___children___id'
  | 'children___children___parent___id'
  | 'children___children___parent___children'
  | 'children___children___children'
  | 'children___children___children___id'
  | 'children___children___children___children'
  | 'children___children___internal___content'
  | 'children___children___internal___contentDigest'
  | 'children___children___internal___description'
  | 'children___children___internal___fieldOwners'
  | 'children___children___internal___ignoreType'
  | 'children___children___internal___mediaType'
  | 'children___children___internal___owner'
  | 'children___children___internal___type'
  | 'children___internal___content'
  | 'children___internal___contentDigest'
  | 'children___internal___description'
  | 'children___internal___fieldOwners'
  | 'children___internal___ignoreType'
  | 'children___internal___mediaType'
  | 'children___internal___owner'
  | 'children___internal___type'
  | 'internal___content'
  | 'internal___contentDigest'
  | 'internal___description'
  | 'internal___fieldOwners'
  | 'internal___ignoreType'
  | 'internal___mediaType'
  | 'internal___owner'
  | 'internal___type';

export type DirectoryFilterInput = {
  sourceInstanceName?: Maybe<StringQueryOperatorInput>;
  absolutePath?: Maybe<StringQueryOperatorInput>;
  relativePath?: Maybe<StringQueryOperatorInput>;
  extension?: Maybe<StringQueryOperatorInput>;
  size?: Maybe<IntQueryOperatorInput>;
  prettySize?: Maybe<StringQueryOperatorInput>;
  modifiedTime?: Maybe<DateQueryOperatorInput>;
  accessTime?: Maybe<DateQueryOperatorInput>;
  changeTime?: Maybe<DateQueryOperatorInput>;
  birthTime?: Maybe<DateQueryOperatorInput>;
  root?: Maybe<StringQueryOperatorInput>;
  dir?: Maybe<StringQueryOperatorInput>;
  base?: Maybe<StringQueryOperatorInput>;
  ext?: Maybe<StringQueryOperatorInput>;
  name?: Maybe<StringQueryOperatorInput>;
  relativeDirectory?: Maybe<StringQueryOperatorInput>;
  dev?: Maybe<IntQueryOperatorInput>;
  mode?: Maybe<IntQueryOperatorInput>;
  nlink?: Maybe<IntQueryOperatorInput>;
  uid?: Maybe<IntQueryOperatorInput>;
  gid?: Maybe<IntQueryOperatorInput>;
  rdev?: Maybe<IntQueryOperatorInput>;
  ino?: Maybe<FloatQueryOperatorInput>;
  atimeMs?: Maybe<FloatQueryOperatorInput>;
  mtimeMs?: Maybe<FloatQueryOperatorInput>;
  ctimeMs?: Maybe<FloatQueryOperatorInput>;
  atime?: Maybe<DateQueryOperatorInput>;
  mtime?: Maybe<DateQueryOperatorInput>;
  ctime?: Maybe<DateQueryOperatorInput>;
  birthtime?: Maybe<DateQueryOperatorInput>;
  birthtimeMs?: Maybe<FloatQueryOperatorInput>;
  blksize?: Maybe<IntQueryOperatorInput>;
  blocks?: Maybe<IntQueryOperatorInput>;
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
};

export type DirectoryGroupConnection = {
  totalCount: Scalars['Int'];
  edges: Array<DirectoryEdge>;
  nodes: Array<Directory>;
  pageInfo: PageInfo;
  field: Scalars['String'];
  fieldValue?: Maybe<Scalars['String']>;
};

export type DirectorySortInput = {
  fields?: Maybe<Array<Maybe<DirectoryFieldsEnum>>>;
  order?: Maybe<Array<Maybe<SortOrderEnum>>>;
};

export type DuotoneGradient = {
  highlight: Scalars['String'];
  shadow: Scalars['String'];
  opacity?: Maybe<Scalars['Int']>;
};

export type File = Node & {
  sourceInstanceName: Scalars['String'];
  absolutePath: Scalars['String'];
  relativePath: Scalars['String'];
  extension: Scalars['String'];
  size: Scalars['Int'];
  prettySize: Scalars['String'];
  modifiedTime: Scalars['Date'];
  accessTime: Scalars['Date'];
  changeTime: Scalars['Date'];
  birthTime: Scalars['Date'];
  root: Scalars['String'];
  dir: Scalars['String'];
  base: Scalars['String'];
  ext: Scalars['String'];
  name: Scalars['String'];
  relativeDirectory: Scalars['String'];
  dev: Scalars['Int'];
  mode: Scalars['Int'];
  nlink: Scalars['Int'];
  uid: Scalars['Int'];
  gid: Scalars['Int'];
  rdev: Scalars['Int'];
  ino: Scalars['Float'];
  atimeMs: Scalars['Float'];
  mtimeMs: Scalars['Float'];
  ctimeMs: Scalars['Float'];
  atime: Scalars['Date'];
  mtime: Scalars['Date'];
  ctime: Scalars['Date'];
  /** @deprecated Use `birthTime` instead */
  birthtime?: Maybe<Scalars['Date']>;
  /** @deprecated Use `birthTime` instead */
  birthtimeMs?: Maybe<Scalars['Float']>;
  blksize?: Maybe<Scalars['Int']>;
  blocks?: Maybe<Scalars['Int']>;
  /** Copy file to static directory and return public url to it */
  publicURL?: Maybe<Scalars['String']>;
  /** Returns all children nodes filtered by type Mdx */
  childrenMdx?: Maybe<Array<Maybe<Mdx>>>;
  /** Returns the first child node of type Mdx or null if there are no children of given type on this node */
  childMdx?: Maybe<Mdx>;
  /** Returns all children nodes filtered by type ImageSharp */
  childrenImageSharp?: Maybe<Array<Maybe<ImageSharp>>>;
  /** Returns the first child node of type ImageSharp or null if there are no children of given type on this node */
  childImageSharp?: Maybe<ImageSharp>;
  id: Scalars['ID'];
  parent?: Maybe<Node>;
  children: Array<Node>;
  internal: Internal;
};


export type FileModifiedTimeArgs = {
  formatString?: Maybe<Scalars['String']>;
  fromNow?: Maybe<Scalars['Boolean']>;
  difference?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
};


export type FileAccessTimeArgs = {
  formatString?: Maybe<Scalars['String']>;
  fromNow?: Maybe<Scalars['Boolean']>;
  difference?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
};


export type FileChangeTimeArgs = {
  formatString?: Maybe<Scalars['String']>;
  fromNow?: Maybe<Scalars['Boolean']>;
  difference?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
};


export type FileBirthTimeArgs = {
  formatString?: Maybe<Scalars['String']>;
  fromNow?: Maybe<Scalars['Boolean']>;
  difference?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
};


export type FileAtimeArgs = {
  formatString?: Maybe<Scalars['String']>;
  fromNow?: Maybe<Scalars['Boolean']>;
  difference?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
};


export type FileMtimeArgs = {
  formatString?: Maybe<Scalars['String']>;
  fromNow?: Maybe<Scalars['Boolean']>;
  difference?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
};


export type FileCtimeArgs = {
  formatString?: Maybe<Scalars['String']>;
  fromNow?: Maybe<Scalars['Boolean']>;
  difference?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
};

export type FileConnection = {
  totalCount: Scalars['Int'];
  edges: Array<FileEdge>;
  nodes: Array<File>;
  pageInfo: PageInfo;
  distinct: Array<Scalars['String']>;
  group: Array<FileGroupConnection>;
};


export type FileConnectionDistinctArgs = {
  field: FileFieldsEnum;
};


export type FileConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  field: FileFieldsEnum;
};

export type FileEdge = {
  next?: Maybe<File>;
  node: File;
  previous?: Maybe<File>;
};

export type FileFieldsEnum = 
  | 'sourceInstanceName'
  | 'absolutePath'
  | 'relativePath'
  | 'extension'
  | 'size'
  | 'prettySize'
  | 'modifiedTime'
  | 'accessTime'
  | 'changeTime'
  | 'birthTime'
  | 'root'
  | 'dir'
  | 'base'
  | 'ext'
  | 'name'
  | 'relativeDirectory'
  | 'dev'
  | 'mode'
  | 'nlink'
  | 'uid'
  | 'gid'
  | 'rdev'
  | 'ino'
  | 'atimeMs'
  | 'mtimeMs'
  | 'ctimeMs'
  | 'atime'
  | 'mtime'
  | 'ctime'
  | 'birthtime'
  | 'birthtimeMs'
  | 'blksize'
  | 'blocks'
  | 'publicURL'
  | 'childrenMdx'
  | 'childrenMdx___inboundReferences'
  | 'childrenMdx___inboundReferences___paragraph'
  | 'childrenMdx___rawBody'
  | 'childrenMdx___fileAbsolutePath'
  | 'childrenMdx___frontmatter___title'
  | 'childrenMdx___frontmatter___spoiler'
  | 'childrenMdx___frontmatter___date'
  | 'childrenMdx___frontmatter___history'
  | 'childrenMdx___frontmatter___historySource'
  | 'childrenMdx___frontmatter___venues'
  | 'childrenMdx___frontmatter___venues___name'
  | 'childrenMdx___frontmatter___venues___link'
  | 'childrenMdx___frontmatter___image___url'
  | 'childrenMdx___frontmatter___image___author'
  | 'childrenMdx___slug'
  | 'childrenMdx___body'
  | 'childrenMdx___excerpt'
  | 'childrenMdx___headings'
  | 'childrenMdx___headings___value'
  | 'childrenMdx___headings___depth'
  | 'childrenMdx___html'
  | 'childrenMdx___mdxAST'
  | 'childrenMdx___tableOfContents___items'
  | 'childrenMdx___tableOfContents___items___url'
  | 'childrenMdx___tableOfContents___items___title'
  | 'childrenMdx___tableOfContents___items___items'
  | 'childrenMdx___timeToRead'
  | 'childrenMdx___wordCount___paragraphs'
  | 'childrenMdx___wordCount___sentences'
  | 'childrenMdx___wordCount___words'
  | 'childrenMdx___socialLinks___edit'
  | 'childrenMdx___socialLinks___tweet'
  | 'childrenMdx___socialLinks___discuss'
  | 'childrenMdx___fields___route'
  | 'childrenMdx___fields___isHidden'
  | 'childrenMdx___fields___history___entries'
  | 'childrenMdx___fields___history___url'
  | 'childrenMdx___fields___readingTime'
  | 'childrenMdx___fields___socialImage___sourceInstanceName'
  | 'childrenMdx___fields___socialImage___absolutePath'
  | 'childrenMdx___fields___socialImage___relativePath'
  | 'childrenMdx___fields___socialImage___extension'
  | 'childrenMdx___fields___socialImage___size'
  | 'childrenMdx___fields___socialImage___prettySize'
  | 'childrenMdx___fields___socialImage___modifiedTime'
  | 'childrenMdx___fields___socialImage___accessTime'
  | 'childrenMdx___fields___socialImage___changeTime'
  | 'childrenMdx___fields___socialImage___birthTime'
  | 'childrenMdx___fields___socialImage___root'
  | 'childrenMdx___fields___socialImage___dir'
  | 'childrenMdx___fields___socialImage___base'
  | 'childrenMdx___fields___socialImage___ext'
  | 'childrenMdx___fields___socialImage___name'
  | 'childrenMdx___fields___socialImage___relativeDirectory'
  | 'childrenMdx___fields___socialImage___dev'
  | 'childrenMdx___fields___socialImage___mode'
  | 'childrenMdx___fields___socialImage___nlink'
  | 'childrenMdx___fields___socialImage___uid'
  | 'childrenMdx___fields___socialImage___gid'
  | 'childrenMdx___fields___socialImage___rdev'
  | 'childrenMdx___fields___socialImage___ino'
  | 'childrenMdx___fields___socialImage___atimeMs'
  | 'childrenMdx___fields___socialImage___mtimeMs'
  | 'childrenMdx___fields___socialImage___ctimeMs'
  | 'childrenMdx___fields___socialImage___atime'
  | 'childrenMdx___fields___socialImage___mtime'
  | 'childrenMdx___fields___socialImage___ctime'
  | 'childrenMdx___fields___socialImage___birthtime'
  | 'childrenMdx___fields___socialImage___birthtimeMs'
  | 'childrenMdx___fields___socialImage___blksize'
  | 'childrenMdx___fields___socialImage___blocks'
  | 'childrenMdx___fields___socialImage___publicURL'
  | 'childrenMdx___fields___socialImage___childrenMdx'
  | 'childrenMdx___fields___socialImage___childrenImageSharp'
  | 'childrenMdx___fields___socialImage___id'
  | 'childrenMdx___fields___socialImage___children'
  | 'childrenMdx___fields___title'
  | 'childrenMdx___childrenGrvscCodeBlock'
  | 'childrenMdx___childrenGrvscCodeBlock___id'
  | 'childrenMdx___childrenGrvscCodeBlock___parent___id'
  | 'childrenMdx___childrenGrvscCodeBlock___parent___children'
  | 'childrenMdx___childrenGrvscCodeBlock___children'
  | 'childrenMdx___childrenGrvscCodeBlock___children___id'
  | 'childrenMdx___childrenGrvscCodeBlock___children___children'
  | 'childrenMdx___childrenGrvscCodeBlock___internal___content'
  | 'childrenMdx___childrenGrvscCodeBlock___internal___contentDigest'
  | 'childrenMdx___childrenGrvscCodeBlock___internal___description'
  | 'childrenMdx___childrenGrvscCodeBlock___internal___fieldOwners'
  | 'childrenMdx___childrenGrvscCodeBlock___internal___ignoreType'
  | 'childrenMdx___childrenGrvscCodeBlock___internal___mediaType'
  | 'childrenMdx___childrenGrvscCodeBlock___internal___owner'
  | 'childrenMdx___childrenGrvscCodeBlock___internal___type'
  | 'childrenMdx___childrenGrvscCodeBlock___index'
  | 'childrenMdx___childrenGrvscCodeBlock___text'
  | 'childrenMdx___childrenGrvscCodeBlock___meta___diff'
  | 'childrenMdx___childrenGrvscCodeBlock___html'
  | 'childrenMdx___childrenGrvscCodeBlock___preClassName'
  | 'childrenMdx___childrenGrvscCodeBlock___codeClassName'
  | 'childrenMdx___childrenGrvscCodeBlock___language'
  | 'childrenMdx___childrenGrvscCodeBlock___defaultTheme___identifier'
  | 'childrenMdx___childrenGrvscCodeBlock___defaultTheme___path'
  | 'childrenMdx___childrenGrvscCodeBlock___defaultTheme___conditions'
  | 'childrenMdx___childrenGrvscCodeBlock___additionalThemes'
  | 'childrenMdx___childrenGrvscCodeBlock___additionalThemes___identifier'
  | 'childrenMdx___childrenGrvscCodeBlock___additionalThemes___path'
  | 'childrenMdx___childrenGrvscCodeBlock___additionalThemes___conditions'
  | 'childrenMdx___childrenGrvscCodeBlock___tokenizedLines'
  | 'childrenMdx___childrenGrvscCodeBlock___tokenizedLines___text'
  | 'childrenMdx___childrenGrvscCodeBlock___tokenizedLines___setContainerClassName'
  | 'childrenMdx___childrenGrvscCodeBlock___tokenizedLines___gutterCells'
  | 'childrenMdx___childrenGrvscCodeBlock___tokenizedLines___className'
  | 'childrenMdx___childrenGrvscCodeBlock___tokenizedLines___tokens'
  | 'childrenMdx___childrenGrvscCodeBlock___tokenizedLines___html'
  | 'childrenMdx___childGrvscCodeBlock___id'
  | 'childrenMdx___childGrvscCodeBlock___parent___id'
  | 'childrenMdx___childGrvscCodeBlock___parent___children'
  | 'childrenMdx___childGrvscCodeBlock___children'
  | 'childrenMdx___childGrvscCodeBlock___children___id'
  | 'childrenMdx___childGrvscCodeBlock___children___children'
  | 'childrenMdx___childGrvscCodeBlock___internal___content'
  | 'childrenMdx___childGrvscCodeBlock___internal___contentDigest'
  | 'childrenMdx___childGrvscCodeBlock___internal___description'
  | 'childrenMdx___childGrvscCodeBlock___internal___fieldOwners'
  | 'childrenMdx___childGrvscCodeBlock___internal___ignoreType'
  | 'childrenMdx___childGrvscCodeBlock___internal___mediaType'
  | 'childrenMdx___childGrvscCodeBlock___internal___owner'
  | 'childrenMdx___childGrvscCodeBlock___internal___type'
  | 'childrenMdx___childGrvscCodeBlock___index'
  | 'childrenMdx___childGrvscCodeBlock___text'
  | 'childrenMdx___childGrvscCodeBlock___meta___diff'
  | 'childrenMdx___childGrvscCodeBlock___html'
  | 'childrenMdx___childGrvscCodeBlock___preClassName'
  | 'childrenMdx___childGrvscCodeBlock___codeClassName'
  | 'childrenMdx___childGrvscCodeBlock___language'
  | 'childrenMdx___childGrvscCodeBlock___defaultTheme___identifier'
  | 'childrenMdx___childGrvscCodeBlock___defaultTheme___path'
  | 'childrenMdx___childGrvscCodeBlock___defaultTheme___conditions'
  | 'childrenMdx___childGrvscCodeBlock___additionalThemes'
  | 'childrenMdx___childGrvscCodeBlock___additionalThemes___identifier'
  | 'childrenMdx___childGrvscCodeBlock___additionalThemes___path'
  | 'childrenMdx___childGrvscCodeBlock___additionalThemes___conditions'
  | 'childrenMdx___childGrvscCodeBlock___tokenizedLines'
  | 'childrenMdx___childGrvscCodeBlock___tokenizedLines___text'
  | 'childrenMdx___childGrvscCodeBlock___tokenizedLines___setContainerClassName'
  | 'childrenMdx___childGrvscCodeBlock___tokenizedLines___gutterCells'
  | 'childrenMdx___childGrvscCodeBlock___tokenizedLines___className'
  | 'childrenMdx___childGrvscCodeBlock___tokenizedLines___tokens'
  | 'childrenMdx___childGrvscCodeBlock___tokenizedLines___html'
  | 'childrenMdx___id'
  | 'childrenMdx___parent___id'
  | 'childrenMdx___parent___parent___id'
  | 'childrenMdx___parent___parent___children'
  | 'childrenMdx___parent___children'
  | 'childrenMdx___parent___children___id'
  | 'childrenMdx___parent___children___children'
  | 'childrenMdx___parent___internal___content'
  | 'childrenMdx___parent___internal___contentDigest'
  | 'childrenMdx___parent___internal___description'
  | 'childrenMdx___parent___internal___fieldOwners'
  | 'childrenMdx___parent___internal___ignoreType'
  | 'childrenMdx___parent___internal___mediaType'
  | 'childrenMdx___parent___internal___owner'
  | 'childrenMdx___parent___internal___type'
  | 'childrenMdx___children'
  | 'childrenMdx___children___id'
  | 'childrenMdx___children___parent___id'
  | 'childrenMdx___children___parent___children'
  | 'childrenMdx___children___children'
  | 'childrenMdx___children___children___id'
  | 'childrenMdx___children___children___children'
  | 'childrenMdx___children___internal___content'
  | 'childrenMdx___children___internal___contentDigest'
  | 'childrenMdx___children___internal___description'
  | 'childrenMdx___children___internal___fieldOwners'
  | 'childrenMdx___children___internal___ignoreType'
  | 'childrenMdx___children___internal___mediaType'
  | 'childrenMdx___children___internal___owner'
  | 'childrenMdx___children___internal___type'
  | 'childrenMdx___internal___content'
  | 'childrenMdx___internal___contentDigest'
  | 'childrenMdx___internal___description'
  | 'childrenMdx___internal___fieldOwners'
  | 'childrenMdx___internal___ignoreType'
  | 'childrenMdx___internal___mediaType'
  | 'childrenMdx___internal___owner'
  | 'childrenMdx___internal___type'
  | 'childMdx___inboundReferences'
  | 'childMdx___inboundReferences___paragraph'
  | 'childMdx___rawBody'
  | 'childMdx___fileAbsolutePath'
  | 'childMdx___frontmatter___title'
  | 'childMdx___frontmatter___spoiler'
  | 'childMdx___frontmatter___date'
  | 'childMdx___frontmatter___history'
  | 'childMdx___frontmatter___historySource'
  | 'childMdx___frontmatter___venues'
  | 'childMdx___frontmatter___venues___name'
  | 'childMdx___frontmatter___venues___link'
  | 'childMdx___frontmatter___image___url'
  | 'childMdx___frontmatter___image___author'
  | 'childMdx___slug'
  | 'childMdx___body'
  | 'childMdx___excerpt'
  | 'childMdx___headings'
  | 'childMdx___headings___value'
  | 'childMdx___headings___depth'
  | 'childMdx___html'
  | 'childMdx___mdxAST'
  | 'childMdx___tableOfContents___items'
  | 'childMdx___tableOfContents___items___url'
  | 'childMdx___tableOfContents___items___title'
  | 'childMdx___tableOfContents___items___items'
  | 'childMdx___timeToRead'
  | 'childMdx___wordCount___paragraphs'
  | 'childMdx___wordCount___sentences'
  | 'childMdx___wordCount___words'
  | 'childMdx___socialLinks___edit'
  | 'childMdx___socialLinks___tweet'
  | 'childMdx___socialLinks___discuss'
  | 'childMdx___fields___route'
  | 'childMdx___fields___isHidden'
  | 'childMdx___fields___history___entries'
  | 'childMdx___fields___history___url'
  | 'childMdx___fields___readingTime'
  | 'childMdx___fields___socialImage___sourceInstanceName'
  | 'childMdx___fields___socialImage___absolutePath'
  | 'childMdx___fields___socialImage___relativePath'
  | 'childMdx___fields___socialImage___extension'
  | 'childMdx___fields___socialImage___size'
  | 'childMdx___fields___socialImage___prettySize'
  | 'childMdx___fields___socialImage___modifiedTime'
  | 'childMdx___fields___socialImage___accessTime'
  | 'childMdx___fields___socialImage___changeTime'
  | 'childMdx___fields___socialImage___birthTime'
  | 'childMdx___fields___socialImage___root'
  | 'childMdx___fields___socialImage___dir'
  | 'childMdx___fields___socialImage___base'
  | 'childMdx___fields___socialImage___ext'
  | 'childMdx___fields___socialImage___name'
  | 'childMdx___fields___socialImage___relativeDirectory'
  | 'childMdx___fields___socialImage___dev'
  | 'childMdx___fields___socialImage___mode'
  | 'childMdx___fields___socialImage___nlink'
  | 'childMdx___fields___socialImage___uid'
  | 'childMdx___fields___socialImage___gid'
  | 'childMdx___fields___socialImage___rdev'
  | 'childMdx___fields___socialImage___ino'
  | 'childMdx___fields___socialImage___atimeMs'
  | 'childMdx___fields___socialImage___mtimeMs'
  | 'childMdx___fields___socialImage___ctimeMs'
  | 'childMdx___fields___socialImage___atime'
  | 'childMdx___fields___socialImage___mtime'
  | 'childMdx___fields___socialImage___ctime'
  | 'childMdx___fields___socialImage___birthtime'
  | 'childMdx___fields___socialImage___birthtimeMs'
  | 'childMdx___fields___socialImage___blksize'
  | 'childMdx___fields___socialImage___blocks'
  | 'childMdx___fields___socialImage___publicURL'
  | 'childMdx___fields___socialImage___childrenMdx'
  | 'childMdx___fields___socialImage___childrenImageSharp'
  | 'childMdx___fields___socialImage___id'
  | 'childMdx___fields___socialImage___children'
  | 'childMdx___fields___title'
  | 'childMdx___childrenGrvscCodeBlock'
  | 'childMdx___childrenGrvscCodeBlock___id'
  | 'childMdx___childrenGrvscCodeBlock___parent___id'
  | 'childMdx___childrenGrvscCodeBlock___parent___children'
  | 'childMdx___childrenGrvscCodeBlock___children'
  | 'childMdx___childrenGrvscCodeBlock___children___id'
  | 'childMdx___childrenGrvscCodeBlock___children___children'
  | 'childMdx___childrenGrvscCodeBlock___internal___content'
  | 'childMdx___childrenGrvscCodeBlock___internal___contentDigest'
  | 'childMdx___childrenGrvscCodeBlock___internal___description'
  | 'childMdx___childrenGrvscCodeBlock___internal___fieldOwners'
  | 'childMdx___childrenGrvscCodeBlock___internal___ignoreType'
  | 'childMdx___childrenGrvscCodeBlock___internal___mediaType'
  | 'childMdx___childrenGrvscCodeBlock___internal___owner'
  | 'childMdx___childrenGrvscCodeBlock___internal___type'
  | 'childMdx___childrenGrvscCodeBlock___index'
  | 'childMdx___childrenGrvscCodeBlock___text'
  | 'childMdx___childrenGrvscCodeBlock___meta___diff'
  | 'childMdx___childrenGrvscCodeBlock___html'
  | 'childMdx___childrenGrvscCodeBlock___preClassName'
  | 'childMdx___childrenGrvscCodeBlock___codeClassName'
  | 'childMdx___childrenGrvscCodeBlock___language'
  | 'childMdx___childrenGrvscCodeBlock___defaultTheme___identifier'
  | 'childMdx___childrenGrvscCodeBlock___defaultTheme___path'
  | 'childMdx___childrenGrvscCodeBlock___defaultTheme___conditions'
  | 'childMdx___childrenGrvscCodeBlock___additionalThemes'
  | 'childMdx___childrenGrvscCodeBlock___additionalThemes___identifier'
  | 'childMdx___childrenGrvscCodeBlock___additionalThemes___path'
  | 'childMdx___childrenGrvscCodeBlock___additionalThemes___conditions'
  | 'childMdx___childrenGrvscCodeBlock___tokenizedLines'
  | 'childMdx___childrenGrvscCodeBlock___tokenizedLines___text'
  | 'childMdx___childrenGrvscCodeBlock___tokenizedLines___setContainerClassName'
  | 'childMdx___childrenGrvscCodeBlock___tokenizedLines___gutterCells'
  | 'childMdx___childrenGrvscCodeBlock___tokenizedLines___className'
  | 'childMdx___childrenGrvscCodeBlock___tokenizedLines___tokens'
  | 'childMdx___childrenGrvscCodeBlock___tokenizedLines___html'
  | 'childMdx___childGrvscCodeBlock___id'
  | 'childMdx___childGrvscCodeBlock___parent___id'
  | 'childMdx___childGrvscCodeBlock___parent___children'
  | 'childMdx___childGrvscCodeBlock___children'
  | 'childMdx___childGrvscCodeBlock___children___id'
  | 'childMdx___childGrvscCodeBlock___children___children'
  | 'childMdx___childGrvscCodeBlock___internal___content'
  | 'childMdx___childGrvscCodeBlock___internal___contentDigest'
  | 'childMdx___childGrvscCodeBlock___internal___description'
  | 'childMdx___childGrvscCodeBlock___internal___fieldOwners'
  | 'childMdx___childGrvscCodeBlock___internal___ignoreType'
  | 'childMdx___childGrvscCodeBlock___internal___mediaType'
  | 'childMdx___childGrvscCodeBlock___internal___owner'
  | 'childMdx___childGrvscCodeBlock___internal___type'
  | 'childMdx___childGrvscCodeBlock___index'
  | 'childMdx___childGrvscCodeBlock___text'
  | 'childMdx___childGrvscCodeBlock___meta___diff'
  | 'childMdx___childGrvscCodeBlock___html'
  | 'childMdx___childGrvscCodeBlock___preClassName'
  | 'childMdx___childGrvscCodeBlock___codeClassName'
  | 'childMdx___childGrvscCodeBlock___language'
  | 'childMdx___childGrvscCodeBlock___defaultTheme___identifier'
  | 'childMdx___childGrvscCodeBlock___defaultTheme___path'
  | 'childMdx___childGrvscCodeBlock___defaultTheme___conditions'
  | 'childMdx___childGrvscCodeBlock___additionalThemes'
  | 'childMdx___childGrvscCodeBlock___additionalThemes___identifier'
  | 'childMdx___childGrvscCodeBlock___additionalThemes___path'
  | 'childMdx___childGrvscCodeBlock___additionalThemes___conditions'
  | 'childMdx___childGrvscCodeBlock___tokenizedLines'
  | 'childMdx___childGrvscCodeBlock___tokenizedLines___text'
  | 'childMdx___childGrvscCodeBlock___tokenizedLines___setContainerClassName'
  | 'childMdx___childGrvscCodeBlock___tokenizedLines___gutterCells'
  | 'childMdx___childGrvscCodeBlock___tokenizedLines___className'
  | 'childMdx___childGrvscCodeBlock___tokenizedLines___tokens'
  | 'childMdx___childGrvscCodeBlock___tokenizedLines___html'
  | 'childMdx___id'
  | 'childMdx___parent___id'
  | 'childMdx___parent___parent___id'
  | 'childMdx___parent___parent___children'
  | 'childMdx___parent___children'
  | 'childMdx___parent___children___id'
  | 'childMdx___parent___children___children'
  | 'childMdx___parent___internal___content'
  | 'childMdx___parent___internal___contentDigest'
  | 'childMdx___parent___internal___description'
  | 'childMdx___parent___internal___fieldOwners'
  | 'childMdx___parent___internal___ignoreType'
  | 'childMdx___parent___internal___mediaType'
  | 'childMdx___parent___internal___owner'
  | 'childMdx___parent___internal___type'
  | 'childMdx___children'
  | 'childMdx___children___id'
  | 'childMdx___children___parent___id'
  | 'childMdx___children___parent___children'
  | 'childMdx___children___children'
  | 'childMdx___children___children___id'
  | 'childMdx___children___children___children'
  | 'childMdx___children___internal___content'
  | 'childMdx___children___internal___contentDigest'
  | 'childMdx___children___internal___description'
  | 'childMdx___children___internal___fieldOwners'
  | 'childMdx___children___internal___ignoreType'
  | 'childMdx___children___internal___mediaType'
  | 'childMdx___children___internal___owner'
  | 'childMdx___children___internal___type'
  | 'childMdx___internal___content'
  | 'childMdx___internal___contentDigest'
  | 'childMdx___internal___description'
  | 'childMdx___internal___fieldOwners'
  | 'childMdx___internal___ignoreType'
  | 'childMdx___internal___mediaType'
  | 'childMdx___internal___owner'
  | 'childMdx___internal___type'
  | 'childrenImageSharp'
  | 'childrenImageSharp___fixed___base64'
  | 'childrenImageSharp___fixed___tracedSVG'
  | 'childrenImageSharp___fixed___aspectRatio'
  | 'childrenImageSharp___fixed___width'
  | 'childrenImageSharp___fixed___height'
  | 'childrenImageSharp___fixed___src'
  | 'childrenImageSharp___fixed___srcSet'
  | 'childrenImageSharp___fixed___srcWebp'
  | 'childrenImageSharp___fixed___srcSetWebp'
  | 'childrenImageSharp___fixed___originalName'
  | 'childrenImageSharp___fluid___base64'
  | 'childrenImageSharp___fluid___tracedSVG'
  | 'childrenImageSharp___fluid___aspectRatio'
  | 'childrenImageSharp___fluid___src'
  | 'childrenImageSharp___fluid___srcSet'
  | 'childrenImageSharp___fluid___srcWebp'
  | 'childrenImageSharp___fluid___srcSetWebp'
  | 'childrenImageSharp___fluid___sizes'
  | 'childrenImageSharp___fluid___originalImg'
  | 'childrenImageSharp___fluid___originalName'
  | 'childrenImageSharp___fluid___presentationWidth'
  | 'childrenImageSharp___fluid___presentationHeight'
  | 'childrenImageSharp___gatsbyImageData'
  | 'childrenImageSharp___original___width'
  | 'childrenImageSharp___original___height'
  | 'childrenImageSharp___original___src'
  | 'childrenImageSharp___resize___src'
  | 'childrenImageSharp___resize___tracedSVG'
  | 'childrenImageSharp___resize___width'
  | 'childrenImageSharp___resize___height'
  | 'childrenImageSharp___resize___aspectRatio'
  | 'childrenImageSharp___resize___originalName'
  | 'childrenImageSharp___id'
  | 'childrenImageSharp___parent___id'
  | 'childrenImageSharp___parent___parent___id'
  | 'childrenImageSharp___parent___parent___children'
  | 'childrenImageSharp___parent___children'
  | 'childrenImageSharp___parent___children___id'
  | 'childrenImageSharp___parent___children___children'
  | 'childrenImageSharp___parent___internal___content'
  | 'childrenImageSharp___parent___internal___contentDigest'
  | 'childrenImageSharp___parent___internal___description'
  | 'childrenImageSharp___parent___internal___fieldOwners'
  | 'childrenImageSharp___parent___internal___ignoreType'
  | 'childrenImageSharp___parent___internal___mediaType'
  | 'childrenImageSharp___parent___internal___owner'
  | 'childrenImageSharp___parent___internal___type'
  | 'childrenImageSharp___children'
  | 'childrenImageSharp___children___id'
  | 'childrenImageSharp___children___parent___id'
  | 'childrenImageSharp___children___parent___children'
  | 'childrenImageSharp___children___children'
  | 'childrenImageSharp___children___children___id'
  | 'childrenImageSharp___children___children___children'
  | 'childrenImageSharp___children___internal___content'
  | 'childrenImageSharp___children___internal___contentDigest'
  | 'childrenImageSharp___children___internal___description'
  | 'childrenImageSharp___children___internal___fieldOwners'
  | 'childrenImageSharp___children___internal___ignoreType'
  | 'childrenImageSharp___children___internal___mediaType'
  | 'childrenImageSharp___children___internal___owner'
  | 'childrenImageSharp___children___internal___type'
  | 'childrenImageSharp___internal___content'
  | 'childrenImageSharp___internal___contentDigest'
  | 'childrenImageSharp___internal___description'
  | 'childrenImageSharp___internal___fieldOwners'
  | 'childrenImageSharp___internal___ignoreType'
  | 'childrenImageSharp___internal___mediaType'
  | 'childrenImageSharp___internal___owner'
  | 'childrenImageSharp___internal___type'
  | 'childImageSharp___fixed___base64'
  | 'childImageSharp___fixed___tracedSVG'
  | 'childImageSharp___fixed___aspectRatio'
  | 'childImageSharp___fixed___width'
  | 'childImageSharp___fixed___height'
  | 'childImageSharp___fixed___src'
  | 'childImageSharp___fixed___srcSet'
  | 'childImageSharp___fixed___srcWebp'
  | 'childImageSharp___fixed___srcSetWebp'
  | 'childImageSharp___fixed___originalName'
  | 'childImageSharp___fluid___base64'
  | 'childImageSharp___fluid___tracedSVG'
  | 'childImageSharp___fluid___aspectRatio'
  | 'childImageSharp___fluid___src'
  | 'childImageSharp___fluid___srcSet'
  | 'childImageSharp___fluid___srcWebp'
  | 'childImageSharp___fluid___srcSetWebp'
  | 'childImageSharp___fluid___sizes'
  | 'childImageSharp___fluid___originalImg'
  | 'childImageSharp___fluid___originalName'
  | 'childImageSharp___fluid___presentationWidth'
  | 'childImageSharp___fluid___presentationHeight'
  | 'childImageSharp___gatsbyImageData'
  | 'childImageSharp___original___width'
  | 'childImageSharp___original___height'
  | 'childImageSharp___original___src'
  | 'childImageSharp___resize___src'
  | 'childImageSharp___resize___tracedSVG'
  | 'childImageSharp___resize___width'
  | 'childImageSharp___resize___height'
  | 'childImageSharp___resize___aspectRatio'
  | 'childImageSharp___resize___originalName'
  | 'childImageSharp___id'
  | 'childImageSharp___parent___id'
  | 'childImageSharp___parent___parent___id'
  | 'childImageSharp___parent___parent___children'
  | 'childImageSharp___parent___children'
  | 'childImageSharp___parent___children___id'
  | 'childImageSharp___parent___children___children'
  | 'childImageSharp___parent___internal___content'
  | 'childImageSharp___parent___internal___contentDigest'
  | 'childImageSharp___parent___internal___description'
  | 'childImageSharp___parent___internal___fieldOwners'
  | 'childImageSharp___parent___internal___ignoreType'
  | 'childImageSharp___parent___internal___mediaType'
  | 'childImageSharp___parent___internal___owner'
  | 'childImageSharp___parent___internal___type'
  | 'childImageSharp___children'
  | 'childImageSharp___children___id'
  | 'childImageSharp___children___parent___id'
  | 'childImageSharp___children___parent___children'
  | 'childImageSharp___children___children'
  | 'childImageSharp___children___children___id'
  | 'childImageSharp___children___children___children'
  | 'childImageSharp___children___internal___content'
  | 'childImageSharp___children___internal___contentDigest'
  | 'childImageSharp___children___internal___description'
  | 'childImageSharp___children___internal___fieldOwners'
  | 'childImageSharp___children___internal___ignoreType'
  | 'childImageSharp___children___internal___mediaType'
  | 'childImageSharp___children___internal___owner'
  | 'childImageSharp___children___internal___type'
  | 'childImageSharp___internal___content'
  | 'childImageSharp___internal___contentDigest'
  | 'childImageSharp___internal___description'
  | 'childImageSharp___internal___fieldOwners'
  | 'childImageSharp___internal___ignoreType'
  | 'childImageSharp___internal___mediaType'
  | 'childImageSharp___internal___owner'
  | 'childImageSharp___internal___type'
  | 'id'
  | 'parent___id'
  | 'parent___parent___id'
  | 'parent___parent___parent___id'
  | 'parent___parent___parent___children'
  | 'parent___parent___children'
  | 'parent___parent___children___id'
  | 'parent___parent___children___children'
  | 'parent___parent___internal___content'
  | 'parent___parent___internal___contentDigest'
  | 'parent___parent___internal___description'
  | 'parent___parent___internal___fieldOwners'
  | 'parent___parent___internal___ignoreType'
  | 'parent___parent___internal___mediaType'
  | 'parent___parent___internal___owner'
  | 'parent___parent___internal___type'
  | 'parent___children'
  | 'parent___children___id'
  | 'parent___children___parent___id'
  | 'parent___children___parent___children'
  | 'parent___children___children'
  | 'parent___children___children___id'
  | 'parent___children___children___children'
  | 'parent___children___internal___content'
  | 'parent___children___internal___contentDigest'
  | 'parent___children___internal___description'
  | 'parent___children___internal___fieldOwners'
  | 'parent___children___internal___ignoreType'
  | 'parent___children___internal___mediaType'
  | 'parent___children___internal___owner'
  | 'parent___children___internal___type'
  | 'parent___internal___content'
  | 'parent___internal___contentDigest'
  | 'parent___internal___description'
  | 'parent___internal___fieldOwners'
  | 'parent___internal___ignoreType'
  | 'parent___internal___mediaType'
  | 'parent___internal___owner'
  | 'parent___internal___type'
  | 'children'
  | 'children___id'
  | 'children___parent___id'
  | 'children___parent___parent___id'
  | 'children___parent___parent___children'
  | 'children___parent___children'
  | 'children___parent___children___id'
  | 'children___parent___children___children'
  | 'children___parent___internal___content'
  | 'children___parent___internal___contentDigest'
  | 'children___parent___internal___description'
  | 'children___parent___internal___fieldOwners'
  | 'children___parent___internal___ignoreType'
  | 'children___parent___internal___mediaType'
  | 'children___parent___internal___owner'
  | 'children___parent___internal___type'
  | 'children___children'
  | 'children___children___id'
  | 'children___children___parent___id'
  | 'children___children___parent___children'
  | 'children___children___children'
  | 'children___children___children___id'
  | 'children___children___children___children'
  | 'children___children___internal___content'
  | 'children___children___internal___contentDigest'
  | 'children___children___internal___description'
  | 'children___children___internal___fieldOwners'
  | 'children___children___internal___ignoreType'
  | 'children___children___internal___mediaType'
  | 'children___children___internal___owner'
  | 'children___children___internal___type'
  | 'children___internal___content'
  | 'children___internal___contentDigest'
  | 'children___internal___description'
  | 'children___internal___fieldOwners'
  | 'children___internal___ignoreType'
  | 'children___internal___mediaType'
  | 'children___internal___owner'
  | 'children___internal___type'
  | 'internal___content'
  | 'internal___contentDigest'
  | 'internal___description'
  | 'internal___fieldOwners'
  | 'internal___ignoreType'
  | 'internal___mediaType'
  | 'internal___owner'
  | 'internal___type';

export type FileFilterInput = {
  sourceInstanceName?: Maybe<StringQueryOperatorInput>;
  absolutePath?: Maybe<StringQueryOperatorInput>;
  relativePath?: Maybe<StringQueryOperatorInput>;
  extension?: Maybe<StringQueryOperatorInput>;
  size?: Maybe<IntQueryOperatorInput>;
  prettySize?: Maybe<StringQueryOperatorInput>;
  modifiedTime?: Maybe<DateQueryOperatorInput>;
  accessTime?: Maybe<DateQueryOperatorInput>;
  changeTime?: Maybe<DateQueryOperatorInput>;
  birthTime?: Maybe<DateQueryOperatorInput>;
  root?: Maybe<StringQueryOperatorInput>;
  dir?: Maybe<StringQueryOperatorInput>;
  base?: Maybe<StringQueryOperatorInput>;
  ext?: Maybe<StringQueryOperatorInput>;
  name?: Maybe<StringQueryOperatorInput>;
  relativeDirectory?: Maybe<StringQueryOperatorInput>;
  dev?: Maybe<IntQueryOperatorInput>;
  mode?: Maybe<IntQueryOperatorInput>;
  nlink?: Maybe<IntQueryOperatorInput>;
  uid?: Maybe<IntQueryOperatorInput>;
  gid?: Maybe<IntQueryOperatorInput>;
  rdev?: Maybe<IntQueryOperatorInput>;
  ino?: Maybe<FloatQueryOperatorInput>;
  atimeMs?: Maybe<FloatQueryOperatorInput>;
  mtimeMs?: Maybe<FloatQueryOperatorInput>;
  ctimeMs?: Maybe<FloatQueryOperatorInput>;
  atime?: Maybe<DateQueryOperatorInput>;
  mtime?: Maybe<DateQueryOperatorInput>;
  ctime?: Maybe<DateQueryOperatorInput>;
  birthtime?: Maybe<DateQueryOperatorInput>;
  birthtimeMs?: Maybe<FloatQueryOperatorInput>;
  blksize?: Maybe<IntQueryOperatorInput>;
  blocks?: Maybe<IntQueryOperatorInput>;
  publicURL?: Maybe<StringQueryOperatorInput>;
  childrenMdx?: Maybe<MdxFilterListInput>;
  childMdx?: Maybe<MdxFilterInput>;
  childrenImageSharp?: Maybe<ImageSharpFilterListInput>;
  childImageSharp?: Maybe<ImageSharpFilterInput>;
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
};

export type FileGroupConnection = {
  totalCount: Scalars['Int'];
  edges: Array<FileEdge>;
  nodes: Array<File>;
  pageInfo: PageInfo;
  field: Scalars['String'];
  fieldValue?: Maybe<Scalars['String']>;
};

export type FileSortInput = {
  fields?: Maybe<Array<Maybe<FileFieldsEnum>>>;
  order?: Maybe<Array<Maybe<SortOrderEnum>>>;
};

export type FloatQueryOperatorInput = {
  eq?: Maybe<Scalars['Float']>;
  ne?: Maybe<Scalars['Float']>;
  gt?: Maybe<Scalars['Float']>;
  gte?: Maybe<Scalars['Float']>;
  lt?: Maybe<Scalars['Float']>;
  lte?: Maybe<Scalars['Float']>;
  in?: Maybe<Array<Maybe<Scalars['Float']>>>;
  nin?: Maybe<Array<Maybe<Scalars['Float']>>>;
};

export type GhContributions = Node & {
  id: Scalars['ID'];
  parent?: Maybe<Node>;
  children: Array<Node>;
  timestamp: Scalars['Float'];
  info: GhContributionsInfo;
  repositoriesWithMergedPRs: Array<GhRepository>;
  internal: Internal;
  mergedRepositories: Array<GhRepository>;
};


export type GhContributionsMergedRepositoriesArgs = {
  first: Scalars['Int'];
  sortByStars?: Maybe<Scalars['Boolean']>;
};

export type GhContributionsConnection = {
  totalCount: Scalars['Int'];
  edges: Array<GhContributionsEdge>;
  nodes: Array<GhContributions>;
  pageInfo: PageInfo;
  distinct: Array<Scalars['String']>;
  group: Array<GhContributionsGroupConnection>;
};


export type GhContributionsConnectionDistinctArgs = {
  field: GhContributionsFieldsEnum;
};


export type GhContributionsConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  field: GhContributionsFieldsEnum;
};

export type GhContributionsEdge = {
  next?: Maybe<GhContributions>;
  node: GhContributions;
  previous?: Maybe<GhContributions>;
};

export type GhContributionsFieldsEnum = 
  | 'id'
  | 'parent___id'
  | 'parent___parent___id'
  | 'parent___parent___parent___id'
  | 'parent___parent___parent___children'
  | 'parent___parent___children'
  | 'parent___parent___children___id'
  | 'parent___parent___children___children'
  | 'parent___parent___internal___content'
  | 'parent___parent___internal___contentDigest'
  | 'parent___parent___internal___description'
  | 'parent___parent___internal___fieldOwners'
  | 'parent___parent___internal___ignoreType'
  | 'parent___parent___internal___mediaType'
  | 'parent___parent___internal___owner'
  | 'parent___parent___internal___type'
  | 'parent___children'
  | 'parent___children___id'
  | 'parent___children___parent___id'
  | 'parent___children___parent___children'
  | 'parent___children___children'
  | 'parent___children___children___id'
  | 'parent___children___children___children'
  | 'parent___children___internal___content'
  | 'parent___children___internal___contentDigest'
  | 'parent___children___internal___description'
  | 'parent___children___internal___fieldOwners'
  | 'parent___children___internal___ignoreType'
  | 'parent___children___internal___mediaType'
  | 'parent___children___internal___owner'
  | 'parent___children___internal___type'
  | 'parent___internal___content'
  | 'parent___internal___contentDigest'
  | 'parent___internal___description'
  | 'parent___internal___fieldOwners'
  | 'parent___internal___ignoreType'
  | 'parent___internal___mediaType'
  | 'parent___internal___owner'
  | 'parent___internal___type'
  | 'children'
  | 'children___id'
  | 'children___parent___id'
  | 'children___parent___parent___id'
  | 'children___parent___parent___children'
  | 'children___parent___children'
  | 'children___parent___children___id'
  | 'children___parent___children___children'
  | 'children___parent___internal___content'
  | 'children___parent___internal___contentDigest'
  | 'children___parent___internal___description'
  | 'children___parent___internal___fieldOwners'
  | 'children___parent___internal___ignoreType'
  | 'children___parent___internal___mediaType'
  | 'children___parent___internal___owner'
  | 'children___parent___internal___type'
  | 'children___children'
  | 'children___children___id'
  | 'children___children___parent___id'
  | 'children___children___parent___children'
  | 'children___children___children'
  | 'children___children___children___id'
  | 'children___children___children___children'
  | 'children___children___internal___content'
  | 'children___children___internal___contentDigest'
  | 'children___children___internal___description'
  | 'children___children___internal___fieldOwners'
  | 'children___children___internal___ignoreType'
  | 'children___children___internal___mediaType'
  | 'children___children___internal___owner'
  | 'children___children___internal___type'
  | 'children___internal___content'
  | 'children___internal___contentDigest'
  | 'children___internal___description'
  | 'children___internal___fieldOwners'
  | 'children___internal___ignoreType'
  | 'children___internal___mediaType'
  | 'children___internal___owner'
  | 'children___internal___type'
  | 'timestamp'
  | 'info___totalPullRequestContributions'
  | 'info___totalCommitContributions'
  | 'info___totalIssueContributions'
  | 'info___totalPullRequestReviewContributions'
  | 'info___popularPullRequestContribution___pullRequest___title'
  | 'repositoriesWithMergedPRs'
  | 'repositoriesWithMergedPRs___stargazerCount'
  | 'repositoriesWithMergedPRs___nameWithOwner'
  | 'internal___content'
  | 'internal___contentDigest'
  | 'internal___description'
  | 'internal___fieldOwners'
  | 'internal___ignoreType'
  | 'internal___mediaType'
  | 'internal___owner'
  | 'internal___type';

export type GhContributionsFilterInput = {
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  timestamp?: Maybe<FloatQueryOperatorInput>;
  info?: Maybe<GhContributionsInfoFilterInput>;
  repositoriesWithMergedPRs?: Maybe<GhRepositoryFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
};

export type GhContributionsGroupConnection = {
  totalCount: Scalars['Int'];
  edges: Array<GhContributionsEdge>;
  nodes: Array<GhContributions>;
  pageInfo: PageInfo;
  field: Scalars['String'];
  fieldValue?: Maybe<Scalars['String']>;
};

export type GhContributionsInfo = {
  totalPullRequestContributions: Scalars['Int'];
  totalCommitContributions: Scalars['Int'];
  totalIssueContributions: Scalars['Int'];
  totalPullRequestReviewContributions: Scalars['Int'];
  popularPullRequestContribution: GhContributionsInfoPopularPullRequestContribution;
};

export type GhContributionsInfoFilterInput = {
  totalPullRequestContributions?: Maybe<IntQueryOperatorInput>;
  totalCommitContributions?: Maybe<IntQueryOperatorInput>;
  totalIssueContributions?: Maybe<IntQueryOperatorInput>;
  totalPullRequestReviewContributions?: Maybe<IntQueryOperatorInput>;
  popularPullRequestContribution?: Maybe<GhContributionsInfoPopularPullRequestContributionFilterInput>;
};

export type GhContributionsInfoPopularPullRequestContribution = {
  pullRequest: GhContributionsInfoPopularPullRequestContributionPullRequest;
};

export type GhContributionsInfoPopularPullRequestContributionFilterInput = {
  pullRequest?: Maybe<GhContributionsInfoPopularPullRequestContributionPullRequestFilterInput>;
};

export type GhContributionsInfoPopularPullRequestContributionPullRequest = {
  title: Scalars['String'];
  repository: GhRepository;
};

export type GhContributionsInfoPopularPullRequestContributionPullRequestFilterInput = {
  title?: Maybe<StringQueryOperatorInput>;
  repository?: Maybe<GhRepositoryFilterInput>;
};

export type GhContributionsSortInput = {
  fields?: Maybe<Array<Maybe<GhContributionsFieldsEnum>>>;
  order?: Maybe<Array<Maybe<SortOrderEnum>>>;
};

export type GhRepository = {
  stargazerCount: Scalars['Int'];
  nameWithOwner: Scalars['String'];
};

export type GhRepositoryFilterInput = {
  stargazerCount?: Maybe<IntQueryOperatorInput>;
  nameWithOwner?: Maybe<StringQueryOperatorInput>;
};

export type GhRepositoryFilterListInput = {
  elemMatch?: Maybe<GhRepositoryFilterInput>;
};

export type GrvscCodeBlock = Node & {
  id: Scalars['ID'];
  parent?: Maybe<Node>;
  children: Array<Node>;
  internal: Internal;
  index?: Maybe<Scalars['Int']>;
  text?: Maybe<Scalars['String']>;
  meta?: Maybe<GrvscCodeBlockMeta>;
  html?: Maybe<Scalars['String']>;
  preClassName?: Maybe<Scalars['String']>;
  codeClassName?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  defaultTheme?: Maybe<GrvscCodeBlockDefaultTheme>;
  additionalThemes?: Maybe<Array<Maybe<GrvscCodeBlockAdditionalThemes>>>;
  tokenizedLines?: Maybe<Array<Maybe<GrvscCodeBlockTokenizedLines>>>;
};

export type GrvscCodeBlockAdditionalThemes = {
  identifier?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  conditions?: Maybe<Array<Maybe<GrvscCodeBlockAdditionalThemesConditions>>>;
};

export type GrvscCodeBlockAdditionalThemesConditions = {
  condition?: Maybe<Scalars['String']>;
};

export type GrvscCodeBlockAdditionalThemesConditionsFilterInput = {
  condition?: Maybe<StringQueryOperatorInput>;
};

export type GrvscCodeBlockAdditionalThemesConditionsFilterListInput = {
  elemMatch?: Maybe<GrvscCodeBlockAdditionalThemesConditionsFilterInput>;
};

export type GrvscCodeBlockAdditionalThemesFilterInput = {
  identifier?: Maybe<StringQueryOperatorInput>;
  path?: Maybe<StringQueryOperatorInput>;
  conditions?: Maybe<GrvscCodeBlockAdditionalThemesConditionsFilterListInput>;
};

export type GrvscCodeBlockAdditionalThemesFilterListInput = {
  elemMatch?: Maybe<GrvscCodeBlockAdditionalThemesFilterInput>;
};

export type GrvscCodeBlockConnection = {
  totalCount: Scalars['Int'];
  edges: Array<GrvscCodeBlockEdge>;
  nodes: Array<GrvscCodeBlock>;
  pageInfo: PageInfo;
  distinct: Array<Scalars['String']>;
  group: Array<GrvscCodeBlockGroupConnection>;
};


export type GrvscCodeBlockConnectionDistinctArgs = {
  field: GrvscCodeBlockFieldsEnum;
};


export type GrvscCodeBlockConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  field: GrvscCodeBlockFieldsEnum;
};

export type GrvscCodeBlockDefaultTheme = {
  identifier?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  conditions?: Maybe<Array<Maybe<GrvscCodeBlockDefaultThemeConditions>>>;
};

export type GrvscCodeBlockDefaultThemeConditions = {
  condition?: Maybe<Scalars['String']>;
};

export type GrvscCodeBlockDefaultThemeConditionsFilterInput = {
  condition?: Maybe<StringQueryOperatorInput>;
};

export type GrvscCodeBlockDefaultThemeConditionsFilterListInput = {
  elemMatch?: Maybe<GrvscCodeBlockDefaultThemeConditionsFilterInput>;
};

export type GrvscCodeBlockDefaultThemeFilterInput = {
  identifier?: Maybe<StringQueryOperatorInput>;
  path?: Maybe<StringQueryOperatorInput>;
  conditions?: Maybe<GrvscCodeBlockDefaultThemeConditionsFilterListInput>;
};

export type GrvscCodeBlockEdge = {
  next?: Maybe<GrvscCodeBlock>;
  node: GrvscCodeBlock;
  previous?: Maybe<GrvscCodeBlock>;
};

export type GrvscCodeBlockFieldsEnum = 
  | 'id'
  | 'parent___id'
  | 'parent___parent___id'
  | 'parent___parent___parent___id'
  | 'parent___parent___parent___children'
  | 'parent___parent___children'
  | 'parent___parent___children___id'
  | 'parent___parent___children___children'
  | 'parent___parent___internal___content'
  | 'parent___parent___internal___contentDigest'
  | 'parent___parent___internal___description'
  | 'parent___parent___internal___fieldOwners'
  | 'parent___parent___internal___ignoreType'
  | 'parent___parent___internal___mediaType'
  | 'parent___parent___internal___owner'
  | 'parent___parent___internal___type'
  | 'parent___children'
  | 'parent___children___id'
  | 'parent___children___parent___id'
  | 'parent___children___parent___children'
  | 'parent___children___children'
  | 'parent___children___children___id'
  | 'parent___children___children___children'
  | 'parent___children___internal___content'
  | 'parent___children___internal___contentDigest'
  | 'parent___children___internal___description'
  | 'parent___children___internal___fieldOwners'
  | 'parent___children___internal___ignoreType'
  | 'parent___children___internal___mediaType'
  | 'parent___children___internal___owner'
  | 'parent___children___internal___type'
  | 'parent___internal___content'
  | 'parent___internal___contentDigest'
  | 'parent___internal___description'
  | 'parent___internal___fieldOwners'
  | 'parent___internal___ignoreType'
  | 'parent___internal___mediaType'
  | 'parent___internal___owner'
  | 'parent___internal___type'
  | 'children'
  | 'children___id'
  | 'children___parent___id'
  | 'children___parent___parent___id'
  | 'children___parent___parent___children'
  | 'children___parent___children'
  | 'children___parent___children___id'
  | 'children___parent___children___children'
  | 'children___parent___internal___content'
  | 'children___parent___internal___contentDigest'
  | 'children___parent___internal___description'
  | 'children___parent___internal___fieldOwners'
  | 'children___parent___internal___ignoreType'
  | 'children___parent___internal___mediaType'
  | 'children___parent___internal___owner'
  | 'children___parent___internal___type'
  | 'children___children'
  | 'children___children___id'
  | 'children___children___parent___id'
  | 'children___children___parent___children'
  | 'children___children___children'
  | 'children___children___children___id'
  | 'children___children___children___children'
  | 'children___children___internal___content'
  | 'children___children___internal___contentDigest'
  | 'children___children___internal___description'
  | 'children___children___internal___fieldOwners'
  | 'children___children___internal___ignoreType'
  | 'children___children___internal___mediaType'
  | 'children___children___internal___owner'
  | 'children___children___internal___type'
  | 'children___internal___content'
  | 'children___internal___contentDigest'
  | 'children___internal___description'
  | 'children___internal___fieldOwners'
  | 'children___internal___ignoreType'
  | 'children___internal___mediaType'
  | 'children___internal___owner'
  | 'children___internal___type'
  | 'internal___content'
  | 'internal___contentDigest'
  | 'internal___description'
  | 'internal___fieldOwners'
  | 'internal___ignoreType'
  | 'internal___mediaType'
  | 'internal___owner'
  | 'internal___type'
  | 'index'
  | 'text'
  | 'meta___diff'
  | 'html'
  | 'preClassName'
  | 'codeClassName'
  | 'language'
  | 'defaultTheme___identifier'
  | 'defaultTheme___path'
  | 'defaultTheme___conditions'
  | 'defaultTheme___conditions___condition'
  | 'additionalThemes'
  | 'additionalThemes___identifier'
  | 'additionalThemes___path'
  | 'additionalThemes___conditions'
  | 'additionalThemes___conditions___condition'
  | 'tokenizedLines'
  | 'tokenizedLines___text'
  | 'tokenizedLines___attrs___class'
  | 'tokenizedLines___data___diff'
  | 'tokenizedLines___setContainerClassName'
  | 'tokenizedLines___gutterCells'
  | 'tokenizedLines___gutterCells___className'
  | 'tokenizedLines___gutterCells___text'
  | 'tokenizedLines___className'
  | 'tokenizedLines___tokens'
  | 'tokenizedLines___tokens___text'
  | 'tokenizedLines___tokens___startIndex'
  | 'tokenizedLines___tokens___endIndex'
  | 'tokenizedLines___tokens___scopes'
  | 'tokenizedLines___tokens___defaultThemeTokenData___themeIdentifier'
  | 'tokenizedLines___tokens___defaultThemeTokenData___className'
  | 'tokenizedLines___tokens___defaultThemeTokenData___bold'
  | 'tokenizedLines___tokens___defaultThemeTokenData___italic'
  | 'tokenizedLines___tokens___defaultThemeTokenData___underline'
  | 'tokenizedLines___tokens___defaultThemeTokenData___meta'
  | 'tokenizedLines___tokens___defaultThemeTokenData___color'
  | 'tokenizedLines___tokens___className'
  | 'tokenizedLines___tokens___html'
  | 'tokenizedLines___html';

export type GrvscCodeBlockFilterInput = {
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
  index?: Maybe<IntQueryOperatorInput>;
  text?: Maybe<StringQueryOperatorInput>;
  meta?: Maybe<GrvscCodeBlockMetaFilterInput>;
  html?: Maybe<StringQueryOperatorInput>;
  preClassName?: Maybe<StringQueryOperatorInput>;
  codeClassName?: Maybe<StringQueryOperatorInput>;
  language?: Maybe<StringQueryOperatorInput>;
  defaultTheme?: Maybe<GrvscCodeBlockDefaultThemeFilterInput>;
  additionalThemes?: Maybe<GrvscCodeBlockAdditionalThemesFilterListInput>;
  tokenizedLines?: Maybe<GrvscCodeBlockTokenizedLinesFilterListInput>;
};

export type GrvscCodeBlockFilterListInput = {
  elemMatch?: Maybe<GrvscCodeBlockFilterInput>;
};

export type GrvscCodeBlockGroupConnection = {
  totalCount: Scalars['Int'];
  edges: Array<GrvscCodeBlockEdge>;
  nodes: Array<GrvscCodeBlock>;
  pageInfo: PageInfo;
  field: Scalars['String'];
  fieldValue?: Maybe<Scalars['String']>;
};

export type GrvscCodeBlockMeta = {
  diff?: Maybe<Scalars['Boolean']>;
};

export type GrvscCodeBlockMetaFilterInput = {
  diff?: Maybe<BooleanQueryOperatorInput>;
};

export type GrvscCodeBlockSortInput = {
  fields?: Maybe<Array<Maybe<GrvscCodeBlockFieldsEnum>>>;
  order?: Maybe<Array<Maybe<SortOrderEnum>>>;
};

export type GrvscCodeBlockTokenizedLines = {
  text?: Maybe<Scalars['String']>;
  attrs?: Maybe<GrvscCodeBlockTokenizedLinesAttrs>;
  data?: Maybe<GrvscCodeBlockTokenizedLinesData>;
  setContainerClassName?: Maybe<Scalars['String']>;
  gutterCells?: Maybe<Array<Maybe<GrvscCodeBlockTokenizedLinesGutterCells>>>;
  className?: Maybe<Scalars['String']>;
  tokens?: Maybe<Array<Maybe<GrvscCodeBlockTokenizedLinesTokens>>>;
  html?: Maybe<Scalars['String']>;
};

export type GrvscCodeBlockTokenizedLinesAttrs = {
  class?: Maybe<Scalars['String']>;
};

export type GrvscCodeBlockTokenizedLinesAttrsFilterInput = {
  class?: Maybe<StringQueryOperatorInput>;
};

export type GrvscCodeBlockTokenizedLinesData = {
  diff?: Maybe<Scalars['String']>;
};

export type GrvscCodeBlockTokenizedLinesDataFilterInput = {
  diff?: Maybe<StringQueryOperatorInput>;
};

export type GrvscCodeBlockTokenizedLinesFilterInput = {
  text?: Maybe<StringQueryOperatorInput>;
  attrs?: Maybe<GrvscCodeBlockTokenizedLinesAttrsFilterInput>;
  data?: Maybe<GrvscCodeBlockTokenizedLinesDataFilterInput>;
  setContainerClassName?: Maybe<StringQueryOperatorInput>;
  gutterCells?: Maybe<GrvscCodeBlockTokenizedLinesGutterCellsFilterListInput>;
  className?: Maybe<StringQueryOperatorInput>;
  tokens?: Maybe<GrvscCodeBlockTokenizedLinesTokensFilterListInput>;
  html?: Maybe<StringQueryOperatorInput>;
};

export type GrvscCodeBlockTokenizedLinesFilterListInput = {
  elemMatch?: Maybe<GrvscCodeBlockTokenizedLinesFilterInput>;
};

export type GrvscCodeBlockTokenizedLinesGutterCells = {
  className?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type GrvscCodeBlockTokenizedLinesGutterCellsFilterInput = {
  className?: Maybe<StringQueryOperatorInput>;
  text?: Maybe<StringQueryOperatorInput>;
};

export type GrvscCodeBlockTokenizedLinesGutterCellsFilterListInput = {
  elemMatch?: Maybe<GrvscCodeBlockTokenizedLinesGutterCellsFilterInput>;
};

export type GrvscCodeBlockTokenizedLinesTokens = {
  text?: Maybe<Scalars['String']>;
  startIndex?: Maybe<Scalars['Int']>;
  endIndex?: Maybe<Scalars['Int']>;
  scopes?: Maybe<Array<Maybe<Scalars['String']>>>;
  defaultThemeTokenData?: Maybe<GrvscCodeBlockTokenizedLinesTokensDefaultThemeTokenData>;
  className?: Maybe<Scalars['String']>;
  html?: Maybe<Scalars['String']>;
};

export type GrvscCodeBlockTokenizedLinesTokensDefaultThemeTokenData = {
  themeIdentifier?: Maybe<Scalars['String']>;
  className?: Maybe<Scalars['String']>;
  bold?: Maybe<Scalars['Boolean']>;
  italic?: Maybe<Scalars['Boolean']>;
  underline?: Maybe<Scalars['Boolean']>;
  meta?: Maybe<Scalars['Int']>;
  color?: Maybe<Scalars['String']>;
};

export type GrvscCodeBlockTokenizedLinesTokensDefaultThemeTokenDataFilterInput = {
  themeIdentifier?: Maybe<StringQueryOperatorInput>;
  className?: Maybe<StringQueryOperatorInput>;
  bold?: Maybe<BooleanQueryOperatorInput>;
  italic?: Maybe<BooleanQueryOperatorInput>;
  underline?: Maybe<BooleanQueryOperatorInput>;
  meta?: Maybe<IntQueryOperatorInput>;
  color?: Maybe<StringQueryOperatorInput>;
};

export type GrvscCodeBlockTokenizedLinesTokensFilterInput = {
  text?: Maybe<StringQueryOperatorInput>;
  startIndex?: Maybe<IntQueryOperatorInput>;
  endIndex?: Maybe<IntQueryOperatorInput>;
  scopes?: Maybe<StringQueryOperatorInput>;
  defaultThemeTokenData?: Maybe<GrvscCodeBlockTokenizedLinesTokensDefaultThemeTokenDataFilterInput>;
  className?: Maybe<StringQueryOperatorInput>;
  html?: Maybe<StringQueryOperatorInput>;
};

export type GrvscCodeBlockTokenizedLinesTokensFilterListInput = {
  elemMatch?: Maybe<GrvscCodeBlockTokenizedLinesTokensFilterInput>;
};

export type HeadingsMdx = 
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6';

export type ImageCropFocus = 
  | 'CENTER'
  | 'NORTH'
  | 'NORTHEAST'
  | 'EAST'
  | 'SOUTHEAST'
  | 'SOUTH'
  | 'SOUTHWEST'
  | 'WEST'
  | 'NORTHWEST'
  | 'ENTROPY'
  | 'ATTENTION';

export type ImageFit = 
  | 'COVER'
  | 'CONTAIN'
  | 'FILL'
  | 'INSIDE'
  | 'OUTSIDE';

export type ImageFormat = 
  | 'NO_CHANGE'
  | 'AUTO'
  | 'JPG'
  | 'PNG'
  | 'WEBP'
  | 'AVIF';

export type ImageLayout = 
  | 'FIXED'
  | 'FULL_WIDTH'
  | 'CONSTRAINED';

export type ImagePlaceholder = 
  | 'DOMINANT_COLOR'
  | 'TRACED_SVG'
  | 'BLURRED'
  | 'NONE';

export type ImageSharp = Node & {
  fixed?: Maybe<ImageSharpFixed>;
  fluid?: Maybe<ImageSharpFluid>;
  gatsbyImageData: Scalars['JSON'];
  original?: Maybe<ImageSharpOriginal>;
  resize?: Maybe<ImageSharpResize>;
  id: Scalars['ID'];
  parent?: Maybe<Node>;
  children: Array<Node>;
  internal: Internal;
};


export type ImageSharpFixedArgs = {
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
  base64Width?: Maybe<Scalars['Int']>;
  jpegProgressive?: Maybe<Scalars['Boolean']>;
  pngCompressionSpeed?: Maybe<Scalars['Int']>;
  grayscale?: Maybe<Scalars['Boolean']>;
  duotone?: Maybe<DuotoneGradient>;
  traceSVG?: Maybe<Potrace>;
  quality?: Maybe<Scalars['Int']>;
  jpegQuality?: Maybe<Scalars['Int']>;
  pngQuality?: Maybe<Scalars['Int']>;
  webpQuality?: Maybe<Scalars['Int']>;
  toFormat?: Maybe<ImageFormat>;
  toFormatBase64?: Maybe<ImageFormat>;
  cropFocus?: Maybe<ImageCropFocus>;
  fit?: Maybe<ImageFit>;
  background?: Maybe<Scalars['String']>;
  rotate?: Maybe<Scalars['Int']>;
  trim?: Maybe<Scalars['Float']>;
};


export type ImageSharpFluidArgs = {
  maxWidth?: Maybe<Scalars['Int']>;
  maxHeight?: Maybe<Scalars['Int']>;
  base64Width?: Maybe<Scalars['Int']>;
  grayscale?: Maybe<Scalars['Boolean']>;
  jpegProgressive?: Maybe<Scalars['Boolean']>;
  pngCompressionSpeed?: Maybe<Scalars['Int']>;
  duotone?: Maybe<DuotoneGradient>;
  traceSVG?: Maybe<Potrace>;
  quality?: Maybe<Scalars['Int']>;
  jpegQuality?: Maybe<Scalars['Int']>;
  pngQuality?: Maybe<Scalars['Int']>;
  webpQuality?: Maybe<Scalars['Int']>;
  toFormat?: Maybe<ImageFormat>;
  toFormatBase64?: Maybe<ImageFormat>;
  cropFocus?: Maybe<ImageCropFocus>;
  fit?: Maybe<ImageFit>;
  background?: Maybe<Scalars['String']>;
  rotate?: Maybe<Scalars['Int']>;
  trim?: Maybe<Scalars['Float']>;
  sizes?: Maybe<Scalars['String']>;
  srcSetBreakpoints?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


export type ImageSharpGatsbyImageDataArgs = {
  layout?: Maybe<ImageLayout>;
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
  aspectRatio?: Maybe<Scalars['Float']>;
  placeholder?: Maybe<ImagePlaceholder>;
  blurredOptions?: Maybe<BlurredOptions>;
  tracedSVGOptions?: Maybe<Potrace>;
  formats?: Maybe<Array<Maybe<ImageFormat>>>;
  outputPixelDensities?: Maybe<Array<Maybe<Scalars['Float']>>>;
  breakpoints?: Maybe<Array<Maybe<Scalars['Int']>>>;
  sizes?: Maybe<Scalars['String']>;
  quality?: Maybe<Scalars['Int']>;
  jpgOptions?: Maybe<JpgOptions>;
  pngOptions?: Maybe<PngOptions>;
  webpOptions?: Maybe<WebPOptions>;
  avifOptions?: Maybe<AvifOptions>;
  transformOptions?: Maybe<TransformOptions>;
  backgroundColor?: Maybe<Scalars['String']>;
};


export type ImageSharpResizeArgs = {
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
  quality?: Maybe<Scalars['Int']>;
  jpegQuality?: Maybe<Scalars['Int']>;
  pngQuality?: Maybe<Scalars['Int']>;
  webpQuality?: Maybe<Scalars['Int']>;
  jpegProgressive?: Maybe<Scalars['Boolean']>;
  pngCompressionLevel?: Maybe<Scalars['Int']>;
  pngCompressionSpeed?: Maybe<Scalars['Int']>;
  grayscale?: Maybe<Scalars['Boolean']>;
  duotone?: Maybe<DuotoneGradient>;
  base64?: Maybe<Scalars['Boolean']>;
  traceSVG?: Maybe<Potrace>;
  toFormat?: Maybe<ImageFormat>;
  cropFocus?: Maybe<ImageCropFocus>;
  fit?: Maybe<ImageFit>;
  background?: Maybe<Scalars['String']>;
  rotate?: Maybe<Scalars['Int']>;
  trim?: Maybe<Scalars['Float']>;
};

export type ImageSharpConnection = {
  totalCount: Scalars['Int'];
  edges: Array<ImageSharpEdge>;
  nodes: Array<ImageSharp>;
  pageInfo: PageInfo;
  distinct: Array<Scalars['String']>;
  group: Array<ImageSharpGroupConnection>;
};


export type ImageSharpConnectionDistinctArgs = {
  field: ImageSharpFieldsEnum;
};


export type ImageSharpConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  field: ImageSharpFieldsEnum;
};

export type ImageSharpEdge = {
  next?: Maybe<ImageSharp>;
  node: ImageSharp;
  previous?: Maybe<ImageSharp>;
};

export type ImageSharpFieldsEnum = 
  | 'fixed___base64'
  | 'fixed___tracedSVG'
  | 'fixed___aspectRatio'
  | 'fixed___width'
  | 'fixed___height'
  | 'fixed___src'
  | 'fixed___srcSet'
  | 'fixed___srcWebp'
  | 'fixed___srcSetWebp'
  | 'fixed___originalName'
  | 'fluid___base64'
  | 'fluid___tracedSVG'
  | 'fluid___aspectRatio'
  | 'fluid___src'
  | 'fluid___srcSet'
  | 'fluid___srcWebp'
  | 'fluid___srcSetWebp'
  | 'fluid___sizes'
  | 'fluid___originalImg'
  | 'fluid___originalName'
  | 'fluid___presentationWidth'
  | 'fluid___presentationHeight'
  | 'gatsbyImageData'
  | 'original___width'
  | 'original___height'
  | 'original___src'
  | 'resize___src'
  | 'resize___tracedSVG'
  | 'resize___width'
  | 'resize___height'
  | 'resize___aspectRatio'
  | 'resize___originalName'
  | 'id'
  | 'parent___id'
  | 'parent___parent___id'
  | 'parent___parent___parent___id'
  | 'parent___parent___parent___children'
  | 'parent___parent___children'
  | 'parent___parent___children___id'
  | 'parent___parent___children___children'
  | 'parent___parent___internal___content'
  | 'parent___parent___internal___contentDigest'
  | 'parent___parent___internal___description'
  | 'parent___parent___internal___fieldOwners'
  | 'parent___parent___internal___ignoreType'
  | 'parent___parent___internal___mediaType'
  | 'parent___parent___internal___owner'
  | 'parent___parent___internal___type'
  | 'parent___children'
  | 'parent___children___id'
  | 'parent___children___parent___id'
  | 'parent___children___parent___children'
  | 'parent___children___children'
  | 'parent___children___children___id'
  | 'parent___children___children___children'
  | 'parent___children___internal___content'
  | 'parent___children___internal___contentDigest'
  | 'parent___children___internal___description'
  | 'parent___children___internal___fieldOwners'
  | 'parent___children___internal___ignoreType'
  | 'parent___children___internal___mediaType'
  | 'parent___children___internal___owner'
  | 'parent___children___internal___type'
  | 'parent___internal___content'
  | 'parent___internal___contentDigest'
  | 'parent___internal___description'
  | 'parent___internal___fieldOwners'
  | 'parent___internal___ignoreType'
  | 'parent___internal___mediaType'
  | 'parent___internal___owner'
  | 'parent___internal___type'
  | 'children'
  | 'children___id'
  | 'children___parent___id'
  | 'children___parent___parent___id'
  | 'children___parent___parent___children'
  | 'children___parent___children'
  | 'children___parent___children___id'
  | 'children___parent___children___children'
  | 'children___parent___internal___content'
  | 'children___parent___internal___contentDigest'
  | 'children___parent___internal___description'
  | 'children___parent___internal___fieldOwners'
  | 'children___parent___internal___ignoreType'
  | 'children___parent___internal___mediaType'
  | 'children___parent___internal___owner'
  | 'children___parent___internal___type'
  | 'children___children'
  | 'children___children___id'
  | 'children___children___parent___id'
  | 'children___children___parent___children'
  | 'children___children___children'
  | 'children___children___children___id'
  | 'children___children___children___children'
  | 'children___children___internal___content'
  | 'children___children___internal___contentDigest'
  | 'children___children___internal___description'
  | 'children___children___internal___fieldOwners'
  | 'children___children___internal___ignoreType'
  | 'children___children___internal___mediaType'
  | 'children___children___internal___owner'
  | 'children___children___internal___type'
  | 'children___internal___content'
  | 'children___internal___contentDigest'
  | 'children___internal___description'
  | 'children___internal___fieldOwners'
  | 'children___internal___ignoreType'
  | 'children___internal___mediaType'
  | 'children___internal___owner'
  | 'children___internal___type'
  | 'internal___content'
  | 'internal___contentDigest'
  | 'internal___description'
  | 'internal___fieldOwners'
  | 'internal___ignoreType'
  | 'internal___mediaType'
  | 'internal___owner'
  | 'internal___type';

export type ImageSharpFilterInput = {
  fixed?: Maybe<ImageSharpFixedFilterInput>;
  fluid?: Maybe<ImageSharpFluidFilterInput>;
  gatsbyImageData?: Maybe<JsonQueryOperatorInput>;
  original?: Maybe<ImageSharpOriginalFilterInput>;
  resize?: Maybe<ImageSharpResizeFilterInput>;
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
};

export type ImageSharpFilterListInput = {
  elemMatch?: Maybe<ImageSharpFilterInput>;
};

export type ImageSharpFixed = {
  base64?: Maybe<Scalars['String']>;
  tracedSVG?: Maybe<Scalars['String']>;
  aspectRatio?: Maybe<Scalars['Float']>;
  width: Scalars['Float'];
  height: Scalars['Float'];
  src: Scalars['String'];
  srcSet: Scalars['String'];
  srcWebp?: Maybe<Scalars['String']>;
  srcSetWebp?: Maybe<Scalars['String']>;
  originalName?: Maybe<Scalars['String']>;
};

export type ImageSharpFixedFilterInput = {
  base64?: Maybe<StringQueryOperatorInput>;
  tracedSVG?: Maybe<StringQueryOperatorInput>;
  aspectRatio?: Maybe<FloatQueryOperatorInput>;
  width?: Maybe<FloatQueryOperatorInput>;
  height?: Maybe<FloatQueryOperatorInput>;
  src?: Maybe<StringQueryOperatorInput>;
  srcSet?: Maybe<StringQueryOperatorInput>;
  srcWebp?: Maybe<StringQueryOperatorInput>;
  srcSetWebp?: Maybe<StringQueryOperatorInput>;
  originalName?: Maybe<StringQueryOperatorInput>;
};

export type ImageSharpFluid = {
  base64?: Maybe<Scalars['String']>;
  tracedSVG?: Maybe<Scalars['String']>;
  aspectRatio: Scalars['Float'];
  src: Scalars['String'];
  srcSet: Scalars['String'];
  srcWebp?: Maybe<Scalars['String']>;
  srcSetWebp?: Maybe<Scalars['String']>;
  sizes: Scalars['String'];
  originalImg?: Maybe<Scalars['String']>;
  originalName?: Maybe<Scalars['String']>;
  presentationWidth: Scalars['Int'];
  presentationHeight: Scalars['Int'];
};

export type ImageSharpFluidFilterInput = {
  base64?: Maybe<StringQueryOperatorInput>;
  tracedSVG?: Maybe<StringQueryOperatorInput>;
  aspectRatio?: Maybe<FloatQueryOperatorInput>;
  src?: Maybe<StringQueryOperatorInput>;
  srcSet?: Maybe<StringQueryOperatorInput>;
  srcWebp?: Maybe<StringQueryOperatorInput>;
  srcSetWebp?: Maybe<StringQueryOperatorInput>;
  sizes?: Maybe<StringQueryOperatorInput>;
  originalImg?: Maybe<StringQueryOperatorInput>;
  originalName?: Maybe<StringQueryOperatorInput>;
  presentationWidth?: Maybe<IntQueryOperatorInput>;
  presentationHeight?: Maybe<IntQueryOperatorInput>;
};

export type ImageSharpGroupConnection = {
  totalCount: Scalars['Int'];
  edges: Array<ImageSharpEdge>;
  nodes: Array<ImageSharp>;
  pageInfo: PageInfo;
  field: Scalars['String'];
  fieldValue?: Maybe<Scalars['String']>;
};

export type ImageSharpOriginal = {
  width?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Float']>;
  src?: Maybe<Scalars['String']>;
};

export type ImageSharpOriginalFilterInput = {
  width?: Maybe<FloatQueryOperatorInput>;
  height?: Maybe<FloatQueryOperatorInput>;
  src?: Maybe<StringQueryOperatorInput>;
};

export type ImageSharpResize = {
  src?: Maybe<Scalars['String']>;
  tracedSVG?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
  aspectRatio?: Maybe<Scalars['Float']>;
  originalName?: Maybe<Scalars['String']>;
};

export type ImageSharpResizeFilterInput = {
  src?: Maybe<StringQueryOperatorInput>;
  tracedSVG?: Maybe<StringQueryOperatorInput>;
  width?: Maybe<IntQueryOperatorInput>;
  height?: Maybe<IntQueryOperatorInput>;
  aspectRatio?: Maybe<FloatQueryOperatorInput>;
  originalName?: Maybe<StringQueryOperatorInput>;
};

export type ImageSharpSortInput = {
  fields?: Maybe<Array<Maybe<ImageSharpFieldsEnum>>>;
  order?: Maybe<Array<Maybe<SortOrderEnum>>>;
};

export type InboundReference = {
  node: ReferenceTarget;
  paragraph: Scalars['String'];
};

export type InboundReferenceFilterInput = {
  paragraph?: Maybe<StringQueryOperatorInput>;
};

export type InboundReferenceFilterListInput = {
  elemMatch?: Maybe<InboundReferenceFilterInput>;
};

export type Internal = {
  content?: Maybe<Scalars['String']>;
  contentDigest: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  fieldOwners?: Maybe<Array<Maybe<Scalars['String']>>>;
  ignoreType?: Maybe<Scalars['Boolean']>;
  mediaType?: Maybe<Scalars['String']>;
  owner: Scalars['String'];
  type: Scalars['String'];
};

export type InternalFilterInput = {
  content?: Maybe<StringQueryOperatorInput>;
  contentDigest?: Maybe<StringQueryOperatorInput>;
  description?: Maybe<StringQueryOperatorInput>;
  fieldOwners?: Maybe<StringQueryOperatorInput>;
  ignoreType?: Maybe<BooleanQueryOperatorInput>;
  mediaType?: Maybe<StringQueryOperatorInput>;
  owner?: Maybe<StringQueryOperatorInput>;
  type?: Maybe<StringQueryOperatorInput>;
};

export type IntQueryOperatorInput = {
  eq?: Maybe<Scalars['Int']>;
  ne?: Maybe<Scalars['Int']>;
  gt?: Maybe<Scalars['Int']>;
  gte?: Maybe<Scalars['Int']>;
  lt?: Maybe<Scalars['Int']>;
  lte?: Maybe<Scalars['Int']>;
  in?: Maybe<Array<Maybe<Scalars['Int']>>>;
  nin?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

export type JpgOptions = {
  quality?: Maybe<Scalars['Int']>;
  progressive?: Maybe<Scalars['Boolean']>;
};


export type JsonQueryOperatorInput = {
  eq?: Maybe<Scalars['JSON']>;
  ne?: Maybe<Scalars['JSON']>;
  in?: Maybe<Array<Maybe<Scalars['JSON']>>>;
  nin?: Maybe<Array<Maybe<Scalars['JSON']>>>;
  regex?: Maybe<Scalars['JSON']>;
  glob?: Maybe<Scalars['JSON']>;
};

export type Mdx = Node & {
  outboundReferences: Array<ReferenceTarget>;
  inboundReferences: Array<InboundReference>;
  rawBody: Scalars['String'];
  fileAbsolutePath: Scalars['String'];
  frontmatter?: Maybe<MdxFrontmatter>;
  slug?: Maybe<Scalars['String']>;
  body: Scalars['String'];
  excerpt: Scalars['String'];
  headings?: Maybe<Array<Maybe<MdxHeadingMdx>>>;
  html?: Maybe<Scalars['String']>;
  mdxAST?: Maybe<Scalars['JSON']>;
  tableOfContents: TableOfContents;
  timeToRead?: Maybe<Scalars['Int']>;
  wordCount?: Maybe<MdxWordCount>;
  socialLinks: SocialLinks;
  fields?: Maybe<MdxFields>;
  /** Returns all children nodes filtered by type GRVSCCodeBlock */
  childrenGrvscCodeBlock?: Maybe<Array<Maybe<GrvscCodeBlock>>>;
  /** Returns the first child node of type GRVSCCodeBlock or null if there are no children of given type on this node */
  childGrvscCodeBlock?: Maybe<GrvscCodeBlock>;
  id: Scalars['ID'];
  parent?: Maybe<Node>;
  children: Array<Node>;
  internal: Internal;
};


export type MdxExcerptArgs = {
  pruneLength?: Maybe<Scalars['Int']>;
  truncate?: Maybe<Scalars['Boolean']>;
};


export type MdxHeadingsArgs = {
  depth?: Maybe<HeadingsMdx>;
};

export type MdxConnection = {
  totalCount: Scalars['Int'];
  edges: Array<MdxEdge>;
  nodes: Array<Mdx>;
  pageInfo: PageInfo;
  distinct: Array<Scalars['String']>;
  group: Array<MdxGroupConnection>;
};


export type MdxConnectionDistinctArgs = {
  field: MdxFieldsEnum;
};


export type MdxConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  field: MdxFieldsEnum;
};

export type MdxEdge = {
  next?: Maybe<Mdx>;
  node: Mdx;
  previous?: Maybe<Mdx>;
};

export type MdxFields = {
  route: Scalars['String'];
  isHidden: Scalars['Boolean'];
  history?: Maybe<BlogpostHistory>;
  readingTime: Scalars['Int'];
  socialImage?: Maybe<File>;
  title?: Maybe<Scalars['String']>;
};

export type MdxFieldsEnum = 
  | 'inboundReferences'
  | 'inboundReferences___paragraph'
  | 'rawBody'
  | 'fileAbsolutePath'
  | 'frontmatter___title'
  | 'frontmatter___spoiler'
  | 'frontmatter___date'
  | 'frontmatter___history'
  | 'frontmatter___historySource'
  | 'frontmatter___venues'
  | 'frontmatter___venues___name'
  | 'frontmatter___venues___link'
  | 'frontmatter___image___url'
  | 'frontmatter___image___author'
  | 'slug'
  | 'body'
  | 'excerpt'
  | 'headings'
  | 'headings___value'
  | 'headings___depth'
  | 'html'
  | 'mdxAST'
  | 'tableOfContents___items'
  | 'tableOfContents___items___url'
  | 'tableOfContents___items___title'
  | 'tableOfContents___items___items'
  | 'tableOfContents___items___items___url'
  | 'tableOfContents___items___items___title'
  | 'tableOfContents___items___items___items'
  | 'timeToRead'
  | 'wordCount___paragraphs'
  | 'wordCount___sentences'
  | 'wordCount___words'
  | 'socialLinks___edit'
  | 'socialLinks___tweet'
  | 'socialLinks___discuss'
  | 'fields___route'
  | 'fields___isHidden'
  | 'fields___history___entries'
  | 'fields___history___entries___abbreviatedCommit'
  | 'fields___history___entries___authorDate'
  | 'fields___history___entries___subject'
  | 'fields___history___entries___body'
  | 'fields___history___url'
  | 'fields___readingTime'
  | 'fields___socialImage___sourceInstanceName'
  | 'fields___socialImage___absolutePath'
  | 'fields___socialImage___relativePath'
  | 'fields___socialImage___extension'
  | 'fields___socialImage___size'
  | 'fields___socialImage___prettySize'
  | 'fields___socialImage___modifiedTime'
  | 'fields___socialImage___accessTime'
  | 'fields___socialImage___changeTime'
  | 'fields___socialImage___birthTime'
  | 'fields___socialImage___root'
  | 'fields___socialImage___dir'
  | 'fields___socialImage___base'
  | 'fields___socialImage___ext'
  | 'fields___socialImage___name'
  | 'fields___socialImage___relativeDirectory'
  | 'fields___socialImage___dev'
  | 'fields___socialImage___mode'
  | 'fields___socialImage___nlink'
  | 'fields___socialImage___uid'
  | 'fields___socialImage___gid'
  | 'fields___socialImage___rdev'
  | 'fields___socialImage___ino'
  | 'fields___socialImage___atimeMs'
  | 'fields___socialImage___mtimeMs'
  | 'fields___socialImage___ctimeMs'
  | 'fields___socialImage___atime'
  | 'fields___socialImage___mtime'
  | 'fields___socialImage___ctime'
  | 'fields___socialImage___birthtime'
  | 'fields___socialImage___birthtimeMs'
  | 'fields___socialImage___blksize'
  | 'fields___socialImage___blocks'
  | 'fields___socialImage___publicURL'
  | 'fields___socialImage___childrenMdx'
  | 'fields___socialImage___childrenMdx___inboundReferences'
  | 'fields___socialImage___childrenMdx___rawBody'
  | 'fields___socialImage___childrenMdx___fileAbsolutePath'
  | 'fields___socialImage___childrenMdx___slug'
  | 'fields___socialImage___childrenMdx___body'
  | 'fields___socialImage___childrenMdx___excerpt'
  | 'fields___socialImage___childrenMdx___headings'
  | 'fields___socialImage___childrenMdx___html'
  | 'fields___socialImage___childrenMdx___mdxAST'
  | 'fields___socialImage___childrenMdx___timeToRead'
  | 'fields___socialImage___childrenMdx___childrenGrvscCodeBlock'
  | 'fields___socialImage___childrenMdx___id'
  | 'fields___socialImage___childrenMdx___children'
  | 'fields___socialImage___childMdx___inboundReferences'
  | 'fields___socialImage___childMdx___rawBody'
  | 'fields___socialImage___childMdx___fileAbsolutePath'
  | 'fields___socialImage___childMdx___slug'
  | 'fields___socialImage___childMdx___body'
  | 'fields___socialImage___childMdx___excerpt'
  | 'fields___socialImage___childMdx___headings'
  | 'fields___socialImage___childMdx___html'
  | 'fields___socialImage___childMdx___mdxAST'
  | 'fields___socialImage___childMdx___timeToRead'
  | 'fields___socialImage___childMdx___childrenGrvscCodeBlock'
  | 'fields___socialImage___childMdx___id'
  | 'fields___socialImage___childMdx___children'
  | 'fields___socialImage___childrenImageSharp'
  | 'fields___socialImage___childrenImageSharp___gatsbyImageData'
  | 'fields___socialImage___childrenImageSharp___id'
  | 'fields___socialImage___childrenImageSharp___children'
  | 'fields___socialImage___childImageSharp___gatsbyImageData'
  | 'fields___socialImage___childImageSharp___id'
  | 'fields___socialImage___childImageSharp___children'
  | 'fields___socialImage___id'
  | 'fields___socialImage___parent___id'
  | 'fields___socialImage___parent___children'
  | 'fields___socialImage___children'
  | 'fields___socialImage___children___id'
  | 'fields___socialImage___children___children'
  | 'fields___socialImage___internal___content'
  | 'fields___socialImage___internal___contentDigest'
  | 'fields___socialImage___internal___description'
  | 'fields___socialImage___internal___fieldOwners'
  | 'fields___socialImage___internal___ignoreType'
  | 'fields___socialImage___internal___mediaType'
  | 'fields___socialImage___internal___owner'
  | 'fields___socialImage___internal___type'
  | 'fields___title'
  | 'childrenGrvscCodeBlock'
  | 'childrenGrvscCodeBlock___id'
  | 'childrenGrvscCodeBlock___parent___id'
  | 'childrenGrvscCodeBlock___parent___parent___id'
  | 'childrenGrvscCodeBlock___parent___parent___children'
  | 'childrenGrvscCodeBlock___parent___children'
  | 'childrenGrvscCodeBlock___parent___children___id'
  | 'childrenGrvscCodeBlock___parent___children___children'
  | 'childrenGrvscCodeBlock___parent___internal___content'
  | 'childrenGrvscCodeBlock___parent___internal___contentDigest'
  | 'childrenGrvscCodeBlock___parent___internal___description'
  | 'childrenGrvscCodeBlock___parent___internal___fieldOwners'
  | 'childrenGrvscCodeBlock___parent___internal___ignoreType'
  | 'childrenGrvscCodeBlock___parent___internal___mediaType'
  | 'childrenGrvscCodeBlock___parent___internal___owner'
  | 'childrenGrvscCodeBlock___parent___internal___type'
  | 'childrenGrvscCodeBlock___children'
  | 'childrenGrvscCodeBlock___children___id'
  | 'childrenGrvscCodeBlock___children___parent___id'
  | 'childrenGrvscCodeBlock___children___parent___children'
  | 'childrenGrvscCodeBlock___children___children'
  | 'childrenGrvscCodeBlock___children___children___id'
  | 'childrenGrvscCodeBlock___children___children___children'
  | 'childrenGrvscCodeBlock___children___internal___content'
  | 'childrenGrvscCodeBlock___children___internal___contentDigest'
  | 'childrenGrvscCodeBlock___children___internal___description'
  | 'childrenGrvscCodeBlock___children___internal___fieldOwners'
  | 'childrenGrvscCodeBlock___children___internal___ignoreType'
  | 'childrenGrvscCodeBlock___children___internal___mediaType'
  | 'childrenGrvscCodeBlock___children___internal___owner'
  | 'childrenGrvscCodeBlock___children___internal___type'
  | 'childrenGrvscCodeBlock___internal___content'
  | 'childrenGrvscCodeBlock___internal___contentDigest'
  | 'childrenGrvscCodeBlock___internal___description'
  | 'childrenGrvscCodeBlock___internal___fieldOwners'
  | 'childrenGrvscCodeBlock___internal___ignoreType'
  | 'childrenGrvscCodeBlock___internal___mediaType'
  | 'childrenGrvscCodeBlock___internal___owner'
  | 'childrenGrvscCodeBlock___internal___type'
  | 'childrenGrvscCodeBlock___index'
  | 'childrenGrvscCodeBlock___text'
  | 'childrenGrvscCodeBlock___meta___diff'
  | 'childrenGrvscCodeBlock___html'
  | 'childrenGrvscCodeBlock___preClassName'
  | 'childrenGrvscCodeBlock___codeClassName'
  | 'childrenGrvscCodeBlock___language'
  | 'childrenGrvscCodeBlock___defaultTheme___identifier'
  | 'childrenGrvscCodeBlock___defaultTheme___path'
  | 'childrenGrvscCodeBlock___defaultTheme___conditions'
  | 'childrenGrvscCodeBlock___defaultTheme___conditions___condition'
  | 'childrenGrvscCodeBlock___additionalThemes'
  | 'childrenGrvscCodeBlock___additionalThemes___identifier'
  | 'childrenGrvscCodeBlock___additionalThemes___path'
  | 'childrenGrvscCodeBlock___additionalThemes___conditions'
  | 'childrenGrvscCodeBlock___additionalThemes___conditions___condition'
  | 'childrenGrvscCodeBlock___tokenizedLines'
  | 'childrenGrvscCodeBlock___tokenizedLines___text'
  | 'childrenGrvscCodeBlock___tokenizedLines___attrs___class'
  | 'childrenGrvscCodeBlock___tokenizedLines___data___diff'
  | 'childrenGrvscCodeBlock___tokenizedLines___setContainerClassName'
  | 'childrenGrvscCodeBlock___tokenizedLines___gutterCells'
  | 'childrenGrvscCodeBlock___tokenizedLines___gutterCells___className'
  | 'childrenGrvscCodeBlock___tokenizedLines___gutterCells___text'
  | 'childrenGrvscCodeBlock___tokenizedLines___className'
  | 'childrenGrvscCodeBlock___tokenizedLines___tokens'
  | 'childrenGrvscCodeBlock___tokenizedLines___tokens___text'
  | 'childrenGrvscCodeBlock___tokenizedLines___tokens___startIndex'
  | 'childrenGrvscCodeBlock___tokenizedLines___tokens___endIndex'
  | 'childrenGrvscCodeBlock___tokenizedLines___tokens___scopes'
  | 'childrenGrvscCodeBlock___tokenizedLines___tokens___className'
  | 'childrenGrvscCodeBlock___tokenizedLines___tokens___html'
  | 'childrenGrvscCodeBlock___tokenizedLines___html'
  | 'childGrvscCodeBlock___id'
  | 'childGrvscCodeBlock___parent___id'
  | 'childGrvscCodeBlock___parent___parent___id'
  | 'childGrvscCodeBlock___parent___parent___children'
  | 'childGrvscCodeBlock___parent___children'
  | 'childGrvscCodeBlock___parent___children___id'
  | 'childGrvscCodeBlock___parent___children___children'
  | 'childGrvscCodeBlock___parent___internal___content'
  | 'childGrvscCodeBlock___parent___internal___contentDigest'
  | 'childGrvscCodeBlock___parent___internal___description'
  | 'childGrvscCodeBlock___parent___internal___fieldOwners'
  | 'childGrvscCodeBlock___parent___internal___ignoreType'
  | 'childGrvscCodeBlock___parent___internal___mediaType'
  | 'childGrvscCodeBlock___parent___internal___owner'
  | 'childGrvscCodeBlock___parent___internal___type'
  | 'childGrvscCodeBlock___children'
  | 'childGrvscCodeBlock___children___id'
  | 'childGrvscCodeBlock___children___parent___id'
  | 'childGrvscCodeBlock___children___parent___children'
  | 'childGrvscCodeBlock___children___children'
  | 'childGrvscCodeBlock___children___children___id'
  | 'childGrvscCodeBlock___children___children___children'
  | 'childGrvscCodeBlock___children___internal___content'
  | 'childGrvscCodeBlock___children___internal___contentDigest'
  | 'childGrvscCodeBlock___children___internal___description'
  | 'childGrvscCodeBlock___children___internal___fieldOwners'
  | 'childGrvscCodeBlock___children___internal___ignoreType'
  | 'childGrvscCodeBlock___children___internal___mediaType'
  | 'childGrvscCodeBlock___children___internal___owner'
  | 'childGrvscCodeBlock___children___internal___type'
  | 'childGrvscCodeBlock___internal___content'
  | 'childGrvscCodeBlock___internal___contentDigest'
  | 'childGrvscCodeBlock___internal___description'
  | 'childGrvscCodeBlock___internal___fieldOwners'
  | 'childGrvscCodeBlock___internal___ignoreType'
  | 'childGrvscCodeBlock___internal___mediaType'
  | 'childGrvscCodeBlock___internal___owner'
  | 'childGrvscCodeBlock___internal___type'
  | 'childGrvscCodeBlock___index'
  | 'childGrvscCodeBlock___text'
  | 'childGrvscCodeBlock___meta___diff'
  | 'childGrvscCodeBlock___html'
  | 'childGrvscCodeBlock___preClassName'
  | 'childGrvscCodeBlock___codeClassName'
  | 'childGrvscCodeBlock___language'
  | 'childGrvscCodeBlock___defaultTheme___identifier'
  | 'childGrvscCodeBlock___defaultTheme___path'
  | 'childGrvscCodeBlock___defaultTheme___conditions'
  | 'childGrvscCodeBlock___defaultTheme___conditions___condition'
  | 'childGrvscCodeBlock___additionalThemes'
  | 'childGrvscCodeBlock___additionalThemes___identifier'
  | 'childGrvscCodeBlock___additionalThemes___path'
  | 'childGrvscCodeBlock___additionalThemes___conditions'
  | 'childGrvscCodeBlock___additionalThemes___conditions___condition'
  | 'childGrvscCodeBlock___tokenizedLines'
  | 'childGrvscCodeBlock___tokenizedLines___text'
  | 'childGrvscCodeBlock___tokenizedLines___attrs___class'
  | 'childGrvscCodeBlock___tokenizedLines___data___diff'
  | 'childGrvscCodeBlock___tokenizedLines___setContainerClassName'
  | 'childGrvscCodeBlock___tokenizedLines___gutterCells'
  | 'childGrvscCodeBlock___tokenizedLines___gutterCells___className'
  | 'childGrvscCodeBlock___tokenizedLines___gutterCells___text'
  | 'childGrvscCodeBlock___tokenizedLines___className'
  | 'childGrvscCodeBlock___tokenizedLines___tokens'
  | 'childGrvscCodeBlock___tokenizedLines___tokens___text'
  | 'childGrvscCodeBlock___tokenizedLines___tokens___startIndex'
  | 'childGrvscCodeBlock___tokenizedLines___tokens___endIndex'
  | 'childGrvscCodeBlock___tokenizedLines___tokens___scopes'
  | 'childGrvscCodeBlock___tokenizedLines___tokens___className'
  | 'childGrvscCodeBlock___tokenizedLines___tokens___html'
  | 'childGrvscCodeBlock___tokenizedLines___html'
  | 'id'
  | 'parent___id'
  | 'parent___parent___id'
  | 'parent___parent___parent___id'
  | 'parent___parent___parent___children'
  | 'parent___parent___children'
  | 'parent___parent___children___id'
  | 'parent___parent___children___children'
  | 'parent___parent___internal___content'
  | 'parent___parent___internal___contentDigest'
  | 'parent___parent___internal___description'
  | 'parent___parent___internal___fieldOwners'
  | 'parent___parent___internal___ignoreType'
  | 'parent___parent___internal___mediaType'
  | 'parent___parent___internal___owner'
  | 'parent___parent___internal___type'
  | 'parent___children'
  | 'parent___children___id'
  | 'parent___children___parent___id'
  | 'parent___children___parent___children'
  | 'parent___children___children'
  | 'parent___children___children___id'
  | 'parent___children___children___children'
  | 'parent___children___internal___content'
  | 'parent___children___internal___contentDigest'
  | 'parent___children___internal___description'
  | 'parent___children___internal___fieldOwners'
  | 'parent___children___internal___ignoreType'
  | 'parent___children___internal___mediaType'
  | 'parent___children___internal___owner'
  | 'parent___children___internal___type'
  | 'parent___internal___content'
  | 'parent___internal___contentDigest'
  | 'parent___internal___description'
  | 'parent___internal___fieldOwners'
  | 'parent___internal___ignoreType'
  | 'parent___internal___mediaType'
  | 'parent___internal___owner'
  | 'parent___internal___type'
  | 'children'
  | 'children___id'
  | 'children___parent___id'
  | 'children___parent___parent___id'
  | 'children___parent___parent___children'
  | 'children___parent___children'
  | 'children___parent___children___id'
  | 'children___parent___children___children'
  | 'children___parent___internal___content'
  | 'children___parent___internal___contentDigest'
  | 'children___parent___internal___description'
  | 'children___parent___internal___fieldOwners'
  | 'children___parent___internal___ignoreType'
  | 'children___parent___internal___mediaType'
  | 'children___parent___internal___owner'
  | 'children___parent___internal___type'
  | 'children___children'
  | 'children___children___id'
  | 'children___children___parent___id'
  | 'children___children___parent___children'
  | 'children___children___children'
  | 'children___children___children___id'
  | 'children___children___children___children'
  | 'children___children___internal___content'
  | 'children___children___internal___contentDigest'
  | 'children___children___internal___description'
  | 'children___children___internal___fieldOwners'
  | 'children___children___internal___ignoreType'
  | 'children___children___internal___mediaType'
  | 'children___children___internal___owner'
  | 'children___children___internal___type'
  | 'children___internal___content'
  | 'children___internal___contentDigest'
  | 'children___internal___description'
  | 'children___internal___fieldOwners'
  | 'children___internal___ignoreType'
  | 'children___internal___mediaType'
  | 'children___internal___owner'
  | 'children___internal___type'
  | 'internal___content'
  | 'internal___contentDigest'
  | 'internal___description'
  | 'internal___fieldOwners'
  | 'internal___ignoreType'
  | 'internal___mediaType'
  | 'internal___owner'
  | 'internal___type';

export type MdxFieldsFilterInput = {
  route?: Maybe<StringQueryOperatorInput>;
  isHidden?: Maybe<BooleanQueryOperatorInput>;
  history?: Maybe<BlogpostHistoryFilterInput>;
  readingTime?: Maybe<IntQueryOperatorInput>;
  socialImage?: Maybe<FileFilterInput>;
  title?: Maybe<StringQueryOperatorInput>;
};

export type MdxFilterInput = {
  inboundReferences?: Maybe<InboundReferenceFilterListInput>;
  rawBody?: Maybe<StringQueryOperatorInput>;
  fileAbsolutePath?: Maybe<StringQueryOperatorInput>;
  frontmatter?: Maybe<MdxFrontmatterFilterInput>;
  slug?: Maybe<StringQueryOperatorInput>;
  body?: Maybe<StringQueryOperatorInput>;
  excerpt?: Maybe<StringQueryOperatorInput>;
  headings?: Maybe<MdxHeadingMdxFilterListInput>;
  html?: Maybe<StringQueryOperatorInput>;
  mdxAST?: Maybe<JsonQueryOperatorInput>;
  tableOfContents?: Maybe<TableOfContentsFilterInput>;
  timeToRead?: Maybe<IntQueryOperatorInput>;
  wordCount?: Maybe<MdxWordCountFilterInput>;
  socialLinks?: Maybe<SocialLinksFilterInput>;
  fields?: Maybe<MdxFieldsFilterInput>;
  childrenGrvscCodeBlock?: Maybe<GrvscCodeBlockFilterListInput>;
  childGrvscCodeBlock?: Maybe<GrvscCodeBlockFilterInput>;
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
};

export type MdxFilterListInput = {
  elemMatch?: Maybe<MdxFilterInput>;
};

export type MdxFrontmatter = {
  title?: Maybe<Scalars['String']>;
  spoiler?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['Date']>;
  history?: Maybe<BlogpostHistoryType>;
  historySource?: Maybe<Scalars['String']>;
  venues?: Maybe<Array<Venue>>;
  image?: Maybe<PostImage>;
  isHidden?: Maybe<Scalars['Boolean']>;
};

export type MdxFrontmatterFilterInput = {
  title?: Maybe<StringQueryOperatorInput>;
  spoiler?: Maybe<StringQueryOperatorInput>;
  date?: Maybe<DateQueryOperatorInput>;
  history?: Maybe<BlogpostHistoryTypeQueryOperatorInput>;
  historySource?: Maybe<StringQueryOperatorInput>;
  venues?: Maybe<VenueFilterListInput>;
  image?: Maybe<PostImageFilterInput>;
};

export type MdxGroupConnection = {
  totalCount: Scalars['Int'];
  edges: Array<MdxEdge>;
  nodes: Array<Mdx>;
  pageInfo: PageInfo;
  field: Scalars['String'];
  fieldValue?: Maybe<Scalars['String']>;
};

export type MdxHeadingMdx = {
  value?: Maybe<Scalars['String']>;
  depth?: Maybe<Scalars['Int']>;
};

export type MdxHeadingMdxFilterInput = {
  value?: Maybe<StringQueryOperatorInput>;
  depth?: Maybe<IntQueryOperatorInput>;
};

export type MdxHeadingMdxFilterListInput = {
  elemMatch?: Maybe<MdxHeadingMdxFilterInput>;
};

export type MdxSortInput = {
  fields?: Maybe<Array<Maybe<MdxFieldsEnum>>>;
  order?: Maybe<Array<Maybe<SortOrderEnum>>>;
};

export type MdxWordCount = {
  paragraphs?: Maybe<Scalars['Int']>;
  sentences?: Maybe<Scalars['Int']>;
  words?: Maybe<Scalars['Int']>;
};

export type MdxWordCountFilterInput = {
  paragraphs?: Maybe<IntQueryOperatorInput>;
  sentences?: Maybe<IntQueryOperatorInput>;
  words?: Maybe<IntQueryOperatorInput>;
};

/** Node Interface */
export type Node = {
  id: Scalars['ID'];
  parent?: Maybe<Node>;
  children: Array<Node>;
  internal: Internal;
};

export type NodeFilterInput = {
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
};

export type NodeFilterListInput = {
  elemMatch?: Maybe<NodeFilterInput>;
};

export type PageInfo = {
  currentPage: Scalars['Int'];
  hasPreviousPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  itemCount: Scalars['Int'];
  pageCount: Scalars['Int'];
  perPage?: Maybe<Scalars['Int']>;
  totalCount: Scalars['Int'];
};

export type PngOptions = {
  quality?: Maybe<Scalars['Int']>;
  compressionSpeed?: Maybe<Scalars['Int']>;
};

export type PostImage = {
  url: Scalars['String'];
  author: Scalars['String'];
};

export type PostImageFilterInput = {
  url?: Maybe<StringQueryOperatorInput>;
  author?: Maybe<StringQueryOperatorInput>;
};

export type Potrace = {
  turnPolicy?: Maybe<PotraceTurnPolicy>;
  turdSize?: Maybe<Scalars['Float']>;
  alphaMax?: Maybe<Scalars['Float']>;
  optCurve?: Maybe<Scalars['Boolean']>;
  optTolerance?: Maybe<Scalars['Float']>;
  threshold?: Maybe<Scalars['Int']>;
  blackOnWhite?: Maybe<Scalars['Boolean']>;
  color?: Maybe<Scalars['String']>;
  background?: Maybe<Scalars['String']>;
};

export type PotraceTurnPolicy = 
  | 'TURNPOLICY_BLACK'
  | 'TURNPOLICY_WHITE'
  | 'TURNPOLICY_LEFT'
  | 'TURNPOLICY_RIGHT'
  | 'TURNPOLICY_MINORITY'
  | 'TURNPOLICY_MAJORITY';

export type Query = {
  file?: Maybe<File>;
  allFile: FileConnection;
  directory?: Maybe<Directory>;
  allDirectory: DirectoryConnection;
  site?: Maybe<Site>;
  allSite: SiteConnection;
  sitePage?: Maybe<SitePage>;
  allSitePage: SitePageConnection;
  themeUiConfig?: Maybe<ThemeUiConfig>;
  allThemeUiConfig: ThemeUiConfigConnection;
  ghContributions?: Maybe<GhContributions>;
  allGhContributions: GhContributionsConnection;
  mdx?: Maybe<Mdx>;
  allMdx: MdxConnection;
  imageSharp?: Maybe<ImageSharp>;
  allImageSharp: ImageSharpConnection;
  grvscCodeBlock?: Maybe<GrvscCodeBlock>;
  allGrvscCodeBlock: GrvscCodeBlockConnection;
  siteBuildMetadata?: Maybe<SiteBuildMetadata>;
  allSiteBuildMetadata: SiteBuildMetadataConnection;
  sitePlugin?: Maybe<SitePlugin>;
  allSitePlugin: SitePluginConnection;
};


export type QueryFileArgs = {
  sourceInstanceName?: Maybe<StringQueryOperatorInput>;
  absolutePath?: Maybe<StringQueryOperatorInput>;
  relativePath?: Maybe<StringQueryOperatorInput>;
  extension?: Maybe<StringQueryOperatorInput>;
  size?: Maybe<IntQueryOperatorInput>;
  prettySize?: Maybe<StringQueryOperatorInput>;
  modifiedTime?: Maybe<DateQueryOperatorInput>;
  accessTime?: Maybe<DateQueryOperatorInput>;
  changeTime?: Maybe<DateQueryOperatorInput>;
  birthTime?: Maybe<DateQueryOperatorInput>;
  root?: Maybe<StringQueryOperatorInput>;
  dir?: Maybe<StringQueryOperatorInput>;
  base?: Maybe<StringQueryOperatorInput>;
  ext?: Maybe<StringQueryOperatorInput>;
  name?: Maybe<StringQueryOperatorInput>;
  relativeDirectory?: Maybe<StringQueryOperatorInput>;
  dev?: Maybe<IntQueryOperatorInput>;
  mode?: Maybe<IntQueryOperatorInput>;
  nlink?: Maybe<IntQueryOperatorInput>;
  uid?: Maybe<IntQueryOperatorInput>;
  gid?: Maybe<IntQueryOperatorInput>;
  rdev?: Maybe<IntQueryOperatorInput>;
  ino?: Maybe<FloatQueryOperatorInput>;
  atimeMs?: Maybe<FloatQueryOperatorInput>;
  mtimeMs?: Maybe<FloatQueryOperatorInput>;
  ctimeMs?: Maybe<FloatQueryOperatorInput>;
  atime?: Maybe<DateQueryOperatorInput>;
  mtime?: Maybe<DateQueryOperatorInput>;
  ctime?: Maybe<DateQueryOperatorInput>;
  birthtime?: Maybe<DateQueryOperatorInput>;
  birthtimeMs?: Maybe<FloatQueryOperatorInput>;
  blksize?: Maybe<IntQueryOperatorInput>;
  blocks?: Maybe<IntQueryOperatorInput>;
  publicURL?: Maybe<StringQueryOperatorInput>;
  childrenMdx?: Maybe<MdxFilterListInput>;
  childMdx?: Maybe<MdxFilterInput>;
  childrenImageSharp?: Maybe<ImageSharpFilterListInput>;
  childImageSharp?: Maybe<ImageSharpFilterInput>;
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
};


export type QueryAllFileArgs = {
  filter?: Maybe<FileFilterInput>;
  sort?: Maybe<FileSortInput>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueryDirectoryArgs = {
  sourceInstanceName?: Maybe<StringQueryOperatorInput>;
  absolutePath?: Maybe<StringQueryOperatorInput>;
  relativePath?: Maybe<StringQueryOperatorInput>;
  extension?: Maybe<StringQueryOperatorInput>;
  size?: Maybe<IntQueryOperatorInput>;
  prettySize?: Maybe<StringQueryOperatorInput>;
  modifiedTime?: Maybe<DateQueryOperatorInput>;
  accessTime?: Maybe<DateQueryOperatorInput>;
  changeTime?: Maybe<DateQueryOperatorInput>;
  birthTime?: Maybe<DateQueryOperatorInput>;
  root?: Maybe<StringQueryOperatorInput>;
  dir?: Maybe<StringQueryOperatorInput>;
  base?: Maybe<StringQueryOperatorInput>;
  ext?: Maybe<StringQueryOperatorInput>;
  name?: Maybe<StringQueryOperatorInput>;
  relativeDirectory?: Maybe<StringQueryOperatorInput>;
  dev?: Maybe<IntQueryOperatorInput>;
  mode?: Maybe<IntQueryOperatorInput>;
  nlink?: Maybe<IntQueryOperatorInput>;
  uid?: Maybe<IntQueryOperatorInput>;
  gid?: Maybe<IntQueryOperatorInput>;
  rdev?: Maybe<IntQueryOperatorInput>;
  ino?: Maybe<FloatQueryOperatorInput>;
  atimeMs?: Maybe<FloatQueryOperatorInput>;
  mtimeMs?: Maybe<FloatQueryOperatorInput>;
  ctimeMs?: Maybe<FloatQueryOperatorInput>;
  atime?: Maybe<DateQueryOperatorInput>;
  mtime?: Maybe<DateQueryOperatorInput>;
  ctime?: Maybe<DateQueryOperatorInput>;
  birthtime?: Maybe<DateQueryOperatorInput>;
  birthtimeMs?: Maybe<FloatQueryOperatorInput>;
  blksize?: Maybe<IntQueryOperatorInput>;
  blocks?: Maybe<IntQueryOperatorInput>;
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
};


export type QueryAllDirectoryArgs = {
  filter?: Maybe<DirectoryFilterInput>;
  sort?: Maybe<DirectorySortInput>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QuerySiteArgs = {
  buildTime?: Maybe<DateQueryOperatorInput>;
  siteMetadata?: Maybe<SiteSiteMetadataFilterInput>;
  port?: Maybe<IntQueryOperatorInput>;
  host?: Maybe<StringQueryOperatorInput>;
  polyfill?: Maybe<BooleanQueryOperatorInput>;
  pathPrefix?: Maybe<StringQueryOperatorInput>;
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
};


export type QueryAllSiteArgs = {
  filter?: Maybe<SiteFilterInput>;
  sort?: Maybe<SiteSortInput>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QuerySitePageArgs = {
  path?: Maybe<StringQueryOperatorInput>;
  component?: Maybe<StringQueryOperatorInput>;
  internalComponentName?: Maybe<StringQueryOperatorInput>;
  componentChunkName?: Maybe<StringQueryOperatorInput>;
  matchPath?: Maybe<StringQueryOperatorInput>;
  socialLinks?: Maybe<SocialLinksFilterInput>;
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
  isCreatedByStatefulCreatePages?: Maybe<BooleanQueryOperatorInput>;
  pluginCreator?: Maybe<SitePluginFilterInput>;
  pluginCreatorId?: Maybe<StringQueryOperatorInput>;
  componentPath?: Maybe<StringQueryOperatorInput>;
};


export type QueryAllSitePageArgs = {
  filter?: Maybe<SitePageFilterInput>;
  sort?: Maybe<SitePageSortInput>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueryThemeUiConfigArgs = {
  preset?: Maybe<JsonQueryOperatorInput>;
  prismPreset?: Maybe<JsonQueryOperatorInput>;
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
};


export type QueryAllThemeUiConfigArgs = {
  filter?: Maybe<ThemeUiConfigFilterInput>;
  sort?: Maybe<ThemeUiConfigSortInput>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueryGhContributionsArgs = {
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  timestamp?: Maybe<FloatQueryOperatorInput>;
  info?: Maybe<GhContributionsInfoFilterInput>;
  repositoriesWithMergedPRs?: Maybe<GhRepositoryFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
};


export type QueryAllGhContributionsArgs = {
  filter?: Maybe<GhContributionsFilterInput>;
  sort?: Maybe<GhContributionsSortInput>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueryMdxArgs = {
  inboundReferences?: Maybe<InboundReferenceFilterListInput>;
  rawBody?: Maybe<StringQueryOperatorInput>;
  fileAbsolutePath?: Maybe<StringQueryOperatorInput>;
  frontmatter?: Maybe<MdxFrontmatterFilterInput>;
  slug?: Maybe<StringQueryOperatorInput>;
  body?: Maybe<StringQueryOperatorInput>;
  excerpt?: Maybe<StringQueryOperatorInput>;
  headings?: Maybe<MdxHeadingMdxFilterListInput>;
  html?: Maybe<StringQueryOperatorInput>;
  mdxAST?: Maybe<JsonQueryOperatorInput>;
  tableOfContents?: Maybe<TableOfContentsFilterInput>;
  timeToRead?: Maybe<IntQueryOperatorInput>;
  wordCount?: Maybe<MdxWordCountFilterInput>;
  socialLinks?: Maybe<SocialLinksFilterInput>;
  fields?: Maybe<MdxFieldsFilterInput>;
  childrenGrvscCodeBlock?: Maybe<GrvscCodeBlockFilterListInput>;
  childGrvscCodeBlock?: Maybe<GrvscCodeBlockFilterInput>;
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
};


export type QueryAllMdxArgs = {
  filter?: Maybe<MdxFilterInput>;
  sort?: Maybe<MdxSortInput>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueryImageSharpArgs = {
  fixed?: Maybe<ImageSharpFixedFilterInput>;
  fluid?: Maybe<ImageSharpFluidFilterInput>;
  gatsbyImageData?: Maybe<JsonQueryOperatorInput>;
  original?: Maybe<ImageSharpOriginalFilterInput>;
  resize?: Maybe<ImageSharpResizeFilterInput>;
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
};


export type QueryAllImageSharpArgs = {
  filter?: Maybe<ImageSharpFilterInput>;
  sort?: Maybe<ImageSharpSortInput>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueryGrvscCodeBlockArgs = {
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
  index?: Maybe<IntQueryOperatorInput>;
  text?: Maybe<StringQueryOperatorInput>;
  meta?: Maybe<GrvscCodeBlockMetaFilterInput>;
  html?: Maybe<StringQueryOperatorInput>;
  preClassName?: Maybe<StringQueryOperatorInput>;
  codeClassName?: Maybe<StringQueryOperatorInput>;
  language?: Maybe<StringQueryOperatorInput>;
  defaultTheme?: Maybe<GrvscCodeBlockDefaultThemeFilterInput>;
  additionalThemes?: Maybe<GrvscCodeBlockAdditionalThemesFilterListInput>;
  tokenizedLines?: Maybe<GrvscCodeBlockTokenizedLinesFilterListInput>;
};


export type QueryAllGrvscCodeBlockArgs = {
  filter?: Maybe<GrvscCodeBlockFilterInput>;
  sort?: Maybe<GrvscCodeBlockSortInput>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QuerySiteBuildMetadataArgs = {
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
  buildTime?: Maybe<DateQueryOperatorInput>;
};


export type QueryAllSiteBuildMetadataArgs = {
  filter?: Maybe<SiteBuildMetadataFilterInput>;
  sort?: Maybe<SiteBuildMetadataSortInput>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QuerySitePluginArgs = {
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
  resolve?: Maybe<StringQueryOperatorInput>;
  name?: Maybe<StringQueryOperatorInput>;
  version?: Maybe<StringQueryOperatorInput>;
  pluginOptions?: Maybe<SitePluginPluginOptionsFilterInput>;
  nodeAPIs?: Maybe<StringQueryOperatorInput>;
  browserAPIs?: Maybe<StringQueryOperatorInput>;
  ssrAPIs?: Maybe<StringQueryOperatorInput>;
  pluginFilepath?: Maybe<StringQueryOperatorInput>;
  packageJson?: Maybe<SitePluginPackageJsonFilterInput>;
};


export type QueryAllSitePluginArgs = {
  filter?: Maybe<SitePluginFilterInput>;
  sort?: Maybe<SitePluginSortInput>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};

export type ReferenceTarget = Mdx;

export type Site = Node & {
  buildTime?: Maybe<Scalars['Date']>;
  siteMetadata?: Maybe<SiteSiteMetadata>;
  port?: Maybe<Scalars['Int']>;
  host?: Maybe<Scalars['String']>;
  polyfill?: Maybe<Scalars['Boolean']>;
  pathPrefix?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  parent?: Maybe<Node>;
  children: Array<Node>;
  internal: Internal;
};


export type SiteBuildTimeArgs = {
  formatString?: Maybe<Scalars['String']>;
  fromNow?: Maybe<Scalars['Boolean']>;
  difference?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
};

export type SiteBuildMetadata = Node & {
  id: Scalars['ID'];
  parent?: Maybe<Node>;
  children: Array<Node>;
  internal: Internal;
  buildTime?: Maybe<Scalars['Date']>;
};


export type SiteBuildMetadataBuildTimeArgs = {
  formatString?: Maybe<Scalars['String']>;
  fromNow?: Maybe<Scalars['Boolean']>;
  difference?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
};

export type SiteBuildMetadataConnection = {
  totalCount: Scalars['Int'];
  edges: Array<SiteBuildMetadataEdge>;
  nodes: Array<SiteBuildMetadata>;
  pageInfo: PageInfo;
  distinct: Array<Scalars['String']>;
  group: Array<SiteBuildMetadataGroupConnection>;
};


export type SiteBuildMetadataConnectionDistinctArgs = {
  field: SiteBuildMetadataFieldsEnum;
};


export type SiteBuildMetadataConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  field: SiteBuildMetadataFieldsEnum;
};

export type SiteBuildMetadataEdge = {
  next?: Maybe<SiteBuildMetadata>;
  node: SiteBuildMetadata;
  previous?: Maybe<SiteBuildMetadata>;
};

export type SiteBuildMetadataFieldsEnum = 
  | 'id'
  | 'parent___id'
  | 'parent___parent___id'
  | 'parent___parent___parent___id'
  | 'parent___parent___parent___children'
  | 'parent___parent___children'
  | 'parent___parent___children___id'
  | 'parent___parent___children___children'
  | 'parent___parent___internal___content'
  | 'parent___parent___internal___contentDigest'
  | 'parent___parent___internal___description'
  | 'parent___parent___internal___fieldOwners'
  | 'parent___parent___internal___ignoreType'
  | 'parent___parent___internal___mediaType'
  | 'parent___parent___internal___owner'
  | 'parent___parent___internal___type'
  | 'parent___children'
  | 'parent___children___id'
  | 'parent___children___parent___id'
  | 'parent___children___parent___children'
  | 'parent___children___children'
  | 'parent___children___children___id'
  | 'parent___children___children___children'
  | 'parent___children___internal___content'
  | 'parent___children___internal___contentDigest'
  | 'parent___children___internal___description'
  | 'parent___children___internal___fieldOwners'
  | 'parent___children___internal___ignoreType'
  | 'parent___children___internal___mediaType'
  | 'parent___children___internal___owner'
  | 'parent___children___internal___type'
  | 'parent___internal___content'
  | 'parent___internal___contentDigest'
  | 'parent___internal___description'
  | 'parent___internal___fieldOwners'
  | 'parent___internal___ignoreType'
  | 'parent___internal___mediaType'
  | 'parent___internal___owner'
  | 'parent___internal___type'
  | 'children'
  | 'children___id'
  | 'children___parent___id'
  | 'children___parent___parent___id'
  | 'children___parent___parent___children'
  | 'children___parent___children'
  | 'children___parent___children___id'
  | 'children___parent___children___children'
  | 'children___parent___internal___content'
  | 'children___parent___internal___contentDigest'
  | 'children___parent___internal___description'
  | 'children___parent___internal___fieldOwners'
  | 'children___parent___internal___ignoreType'
  | 'children___parent___internal___mediaType'
  | 'children___parent___internal___owner'
  | 'children___parent___internal___type'
  | 'children___children'
  | 'children___children___id'
  | 'children___children___parent___id'
  | 'children___children___parent___children'
  | 'children___children___children'
  | 'children___children___children___id'
  | 'children___children___children___children'
  | 'children___children___internal___content'
  | 'children___children___internal___contentDigest'
  | 'children___children___internal___description'
  | 'children___children___internal___fieldOwners'
  | 'children___children___internal___ignoreType'
  | 'children___children___internal___mediaType'
  | 'children___children___internal___owner'
  | 'children___children___internal___type'
  | 'children___internal___content'
  | 'children___internal___contentDigest'
  | 'children___internal___description'
  | 'children___internal___fieldOwners'
  | 'children___internal___ignoreType'
  | 'children___internal___mediaType'
  | 'children___internal___owner'
  | 'children___internal___type'
  | 'internal___content'
  | 'internal___contentDigest'
  | 'internal___description'
  | 'internal___fieldOwners'
  | 'internal___ignoreType'
  | 'internal___mediaType'
  | 'internal___owner'
  | 'internal___type'
  | 'buildTime';

export type SiteBuildMetadataFilterInput = {
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
  buildTime?: Maybe<DateQueryOperatorInput>;
};

export type SiteBuildMetadataGroupConnection = {
  totalCount: Scalars['Int'];
  edges: Array<SiteBuildMetadataEdge>;
  nodes: Array<SiteBuildMetadata>;
  pageInfo: PageInfo;
  field: Scalars['String'];
  fieldValue?: Maybe<Scalars['String']>;
};

export type SiteBuildMetadataSortInput = {
  fields?: Maybe<Array<Maybe<SiteBuildMetadataFieldsEnum>>>;
  order?: Maybe<Array<Maybe<SortOrderEnum>>>;
};

export type SiteConnection = {
  totalCount: Scalars['Int'];
  edges: Array<SiteEdge>;
  nodes: Array<Site>;
  pageInfo: PageInfo;
  distinct: Array<Scalars['String']>;
  group: Array<SiteGroupConnection>;
};


export type SiteConnectionDistinctArgs = {
  field: SiteFieldsEnum;
};


export type SiteConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  field: SiteFieldsEnum;
};

export type SiteEdge = {
  next?: Maybe<Site>;
  node: Site;
  previous?: Maybe<Site>;
};

export type SiteFieldsEnum = 
  | 'buildTime'
  | 'siteMetadata___title'
  | 'siteMetadata___description'
  | 'siteMetadata___titleTemplate'
  | 'siteMetadata___author'
  | 'siteMetadata___social'
  | 'siteMetadata___social___name'
  | 'siteMetadata___social___url'
  | 'siteMetadata___siteUrl'
  | 'siteMetadata___htmlAttributes___lang'
  | 'siteMetadata___twitterUsername'
  | 'port'
  | 'host'
  | 'polyfill'
  | 'pathPrefix'
  | 'id'
  | 'parent___id'
  | 'parent___parent___id'
  | 'parent___parent___parent___id'
  | 'parent___parent___parent___children'
  | 'parent___parent___children'
  | 'parent___parent___children___id'
  | 'parent___parent___children___children'
  | 'parent___parent___internal___content'
  | 'parent___parent___internal___contentDigest'
  | 'parent___parent___internal___description'
  | 'parent___parent___internal___fieldOwners'
  | 'parent___parent___internal___ignoreType'
  | 'parent___parent___internal___mediaType'
  | 'parent___parent___internal___owner'
  | 'parent___parent___internal___type'
  | 'parent___children'
  | 'parent___children___id'
  | 'parent___children___parent___id'
  | 'parent___children___parent___children'
  | 'parent___children___children'
  | 'parent___children___children___id'
  | 'parent___children___children___children'
  | 'parent___children___internal___content'
  | 'parent___children___internal___contentDigest'
  | 'parent___children___internal___description'
  | 'parent___children___internal___fieldOwners'
  | 'parent___children___internal___ignoreType'
  | 'parent___children___internal___mediaType'
  | 'parent___children___internal___owner'
  | 'parent___children___internal___type'
  | 'parent___internal___content'
  | 'parent___internal___contentDigest'
  | 'parent___internal___description'
  | 'parent___internal___fieldOwners'
  | 'parent___internal___ignoreType'
  | 'parent___internal___mediaType'
  | 'parent___internal___owner'
  | 'parent___internal___type'
  | 'children'
  | 'children___id'
  | 'children___parent___id'
  | 'children___parent___parent___id'
  | 'children___parent___parent___children'
  | 'children___parent___children'
  | 'children___parent___children___id'
  | 'children___parent___children___children'
  | 'children___parent___internal___content'
  | 'children___parent___internal___contentDigest'
  | 'children___parent___internal___description'
  | 'children___parent___internal___fieldOwners'
  | 'children___parent___internal___ignoreType'
  | 'children___parent___internal___mediaType'
  | 'children___parent___internal___owner'
  | 'children___parent___internal___type'
  | 'children___children'
  | 'children___children___id'
  | 'children___children___parent___id'
  | 'children___children___parent___children'
  | 'children___children___children'
  | 'children___children___children___id'
  | 'children___children___children___children'
  | 'children___children___internal___content'
  | 'children___children___internal___contentDigest'
  | 'children___children___internal___description'
  | 'children___children___internal___fieldOwners'
  | 'children___children___internal___ignoreType'
  | 'children___children___internal___mediaType'
  | 'children___children___internal___owner'
  | 'children___children___internal___type'
  | 'children___internal___content'
  | 'children___internal___contentDigest'
  | 'children___internal___description'
  | 'children___internal___fieldOwners'
  | 'children___internal___ignoreType'
  | 'children___internal___mediaType'
  | 'children___internal___owner'
  | 'children___internal___type'
  | 'internal___content'
  | 'internal___contentDigest'
  | 'internal___description'
  | 'internal___fieldOwners'
  | 'internal___ignoreType'
  | 'internal___mediaType'
  | 'internal___owner'
  | 'internal___type';

export type SiteFilterInput = {
  buildTime?: Maybe<DateQueryOperatorInput>;
  siteMetadata?: Maybe<SiteSiteMetadataFilterInput>;
  port?: Maybe<IntQueryOperatorInput>;
  host?: Maybe<StringQueryOperatorInput>;
  polyfill?: Maybe<BooleanQueryOperatorInput>;
  pathPrefix?: Maybe<StringQueryOperatorInput>;
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
};

export type SiteGroupConnection = {
  totalCount: Scalars['Int'];
  edges: Array<SiteEdge>;
  nodes: Array<Site>;
  pageInfo: PageInfo;
  field: Scalars['String'];
  fieldValue?: Maybe<Scalars['String']>;
};

export type SitePage = Node & {
  path: Scalars['String'];
  component: Scalars['String'];
  internalComponentName: Scalars['String'];
  componentChunkName: Scalars['String'];
  matchPath?: Maybe<Scalars['String']>;
  socialLinks: SocialLinks;
  id: Scalars['ID'];
  parent?: Maybe<Node>;
  children: Array<Node>;
  internal: Internal;
  isCreatedByStatefulCreatePages?: Maybe<Scalars['Boolean']>;
  pluginCreator?: Maybe<SitePlugin>;
  pluginCreatorId?: Maybe<Scalars['String']>;
  componentPath?: Maybe<Scalars['String']>;
};

export type SitePageConnection = {
  totalCount: Scalars['Int'];
  edges: Array<SitePageEdge>;
  nodes: Array<SitePage>;
  pageInfo: PageInfo;
  distinct: Array<Scalars['String']>;
  group: Array<SitePageGroupConnection>;
};


export type SitePageConnectionDistinctArgs = {
  field: SitePageFieldsEnum;
};


export type SitePageConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  field: SitePageFieldsEnum;
};

export type SitePageEdge = {
  next?: Maybe<SitePage>;
  node: SitePage;
  previous?: Maybe<SitePage>;
};

export type SitePageFieldsEnum = 
  | 'path'
  | 'component'
  | 'internalComponentName'
  | 'componentChunkName'
  | 'matchPath'
  | 'socialLinks___edit'
  | 'socialLinks___tweet'
  | 'socialLinks___discuss'
  | 'id'
  | 'parent___id'
  | 'parent___parent___id'
  | 'parent___parent___parent___id'
  | 'parent___parent___parent___children'
  | 'parent___parent___children'
  | 'parent___parent___children___id'
  | 'parent___parent___children___children'
  | 'parent___parent___internal___content'
  | 'parent___parent___internal___contentDigest'
  | 'parent___parent___internal___description'
  | 'parent___parent___internal___fieldOwners'
  | 'parent___parent___internal___ignoreType'
  | 'parent___parent___internal___mediaType'
  | 'parent___parent___internal___owner'
  | 'parent___parent___internal___type'
  | 'parent___children'
  | 'parent___children___id'
  | 'parent___children___parent___id'
  | 'parent___children___parent___children'
  | 'parent___children___children'
  | 'parent___children___children___id'
  | 'parent___children___children___children'
  | 'parent___children___internal___content'
  | 'parent___children___internal___contentDigest'
  | 'parent___children___internal___description'
  | 'parent___children___internal___fieldOwners'
  | 'parent___children___internal___ignoreType'
  | 'parent___children___internal___mediaType'
  | 'parent___children___internal___owner'
  | 'parent___children___internal___type'
  | 'parent___internal___content'
  | 'parent___internal___contentDigest'
  | 'parent___internal___description'
  | 'parent___internal___fieldOwners'
  | 'parent___internal___ignoreType'
  | 'parent___internal___mediaType'
  | 'parent___internal___owner'
  | 'parent___internal___type'
  | 'children'
  | 'children___id'
  | 'children___parent___id'
  | 'children___parent___parent___id'
  | 'children___parent___parent___children'
  | 'children___parent___children'
  | 'children___parent___children___id'
  | 'children___parent___children___children'
  | 'children___parent___internal___content'
  | 'children___parent___internal___contentDigest'
  | 'children___parent___internal___description'
  | 'children___parent___internal___fieldOwners'
  | 'children___parent___internal___ignoreType'
  | 'children___parent___internal___mediaType'
  | 'children___parent___internal___owner'
  | 'children___parent___internal___type'
  | 'children___children'
  | 'children___children___id'
  | 'children___children___parent___id'
  | 'children___children___parent___children'
  | 'children___children___children'
  | 'children___children___children___id'
  | 'children___children___children___children'
  | 'children___children___internal___content'
  | 'children___children___internal___contentDigest'
  | 'children___children___internal___description'
  | 'children___children___internal___fieldOwners'
  | 'children___children___internal___ignoreType'
  | 'children___children___internal___mediaType'
  | 'children___children___internal___owner'
  | 'children___children___internal___type'
  | 'children___internal___content'
  | 'children___internal___contentDigest'
  | 'children___internal___description'
  | 'children___internal___fieldOwners'
  | 'children___internal___ignoreType'
  | 'children___internal___mediaType'
  | 'children___internal___owner'
  | 'children___internal___type'
  | 'internal___content'
  | 'internal___contentDigest'
  | 'internal___description'
  | 'internal___fieldOwners'
  | 'internal___ignoreType'
  | 'internal___mediaType'
  | 'internal___owner'
  | 'internal___type'
  | 'isCreatedByStatefulCreatePages'
  | 'pluginCreator___id'
  | 'pluginCreator___parent___id'
  | 'pluginCreator___parent___parent___id'
  | 'pluginCreator___parent___parent___children'
  | 'pluginCreator___parent___children'
  | 'pluginCreator___parent___children___id'
  | 'pluginCreator___parent___children___children'
  | 'pluginCreator___parent___internal___content'
  | 'pluginCreator___parent___internal___contentDigest'
  | 'pluginCreator___parent___internal___description'
  | 'pluginCreator___parent___internal___fieldOwners'
  | 'pluginCreator___parent___internal___ignoreType'
  | 'pluginCreator___parent___internal___mediaType'
  | 'pluginCreator___parent___internal___owner'
  | 'pluginCreator___parent___internal___type'
  | 'pluginCreator___children'
  | 'pluginCreator___children___id'
  | 'pluginCreator___children___parent___id'
  | 'pluginCreator___children___parent___children'
  | 'pluginCreator___children___children'
  | 'pluginCreator___children___children___id'
  | 'pluginCreator___children___children___children'
  | 'pluginCreator___children___internal___content'
  | 'pluginCreator___children___internal___contentDigest'
  | 'pluginCreator___children___internal___description'
  | 'pluginCreator___children___internal___fieldOwners'
  | 'pluginCreator___children___internal___ignoreType'
  | 'pluginCreator___children___internal___mediaType'
  | 'pluginCreator___children___internal___owner'
  | 'pluginCreator___children___internal___type'
  | 'pluginCreator___internal___content'
  | 'pluginCreator___internal___contentDigest'
  | 'pluginCreator___internal___description'
  | 'pluginCreator___internal___fieldOwners'
  | 'pluginCreator___internal___ignoreType'
  | 'pluginCreator___internal___mediaType'
  | 'pluginCreator___internal___owner'
  | 'pluginCreator___internal___type'
  | 'pluginCreator___resolve'
  | 'pluginCreator___name'
  | 'pluginCreator___version'
  | 'pluginCreator___pluginOptions___extensions'
  | 'pluginCreator___pluginOptions___commonmark'
  | 'pluginCreator___pluginOptions___gatsbyRemarkPlugins'
  | 'pluginCreator___pluginOptions___gatsbyRemarkPlugins___resolve'
  | 'pluginCreator___pluginOptions___defaultLayouts___posts'
  | 'pluginCreator___pluginOptions___defaultLayouts___speaking'
  | 'pluginCreator___pluginOptions___defaultLayouts___notes'
  | 'pluginCreator___pluginOptions___path'
  | 'pluginCreator___pluginOptions___name'
  | 'pluginCreator___pluginOptions___contentPath'
  | 'pluginCreator___pluginOptions___pluginMdxOptions___extensions'
  | 'pluginCreator___pluginOptions___pluginMdxOptions___commonmark'
  | 'pluginCreator___pluginOptions___pluginMdxOptions___gatsbyRemarkPlugins'
  | 'pluginCreator___pluginOptions___markdownReferences___contentPath'
  | 'pluginCreator___pluginOptions___base64Width'
  | 'pluginCreator___pluginOptions___stripMetadata'
  | 'pluginCreator___pluginOptions___defaultQuality'
  | 'pluginCreator___pluginOptions___failOnError'
  | 'pluginCreator___pluginOptions___allowNamespaces'
  | 'pluginCreator___pluginOptions___isTSX'
  | 'pluginCreator___pluginOptions___jsxPragma'
  | 'pluginCreator___pluginOptions___allExtensions'
  | 'pluginCreator___pluginOptions___documentPaths'
  | 'pluginCreator___pluginOptions___localSchemaFile'
  | 'pluginCreator___pluginOptions___output'
  | 'pluginCreator___pluginOptions___includes'
  | 'pluginCreator___pluginOptions___short_name'
  | 'pluginCreator___pluginOptions___start_url'
  | 'pluginCreator___pluginOptions___background_color'
  | 'pluginCreator___pluginOptions___theme_color'
  | 'pluginCreator___pluginOptions___icon'
  | 'pluginCreator___pluginOptions___legacy'
  | 'pluginCreator___pluginOptions___theme_color_in_head'
  | 'pluginCreator___pluginOptions___cache_busting_mode'
  | 'pluginCreator___pluginOptions___crossOrigin'
  | 'pluginCreator___pluginOptions___include_favicon'
  | 'pluginCreator___pluginOptions___cacheDigest'
  | 'pluginCreator___pluginOptions___exclude'
  | 'pluginCreator___pluginOptions___createLinkInHead'
  | 'pluginCreator___pluginOptions___query'
  | 'pluginCreator___pluginOptions___feeds'
  | 'pluginCreator___pluginOptions___feeds___query'
  | 'pluginCreator___pluginOptions___feeds___output'
  | 'pluginCreator___pluginOptions___feeds___title'
  | 'pluginCreator___pluginOptions___pathCheck'
  | 'pluginCreator___nodeAPIs'
  | 'pluginCreator___browserAPIs'
  | 'pluginCreator___ssrAPIs'
  | 'pluginCreator___pluginFilepath'
  | 'pluginCreator___packageJson___name'
  | 'pluginCreator___packageJson___description'
  | 'pluginCreator___packageJson___version'
  | 'pluginCreator___packageJson___main'
  | 'pluginCreator___packageJson___author'
  | 'pluginCreator___packageJson___license'
  | 'pluginCreator___packageJson___dependencies'
  | 'pluginCreator___packageJson___dependencies___name'
  | 'pluginCreator___packageJson___dependencies___version'
  | 'pluginCreator___packageJson___devDependencies'
  | 'pluginCreator___packageJson___devDependencies___name'
  | 'pluginCreator___packageJson___devDependencies___version'
  | 'pluginCreator___packageJson___peerDependencies'
  | 'pluginCreator___packageJson___peerDependencies___name'
  | 'pluginCreator___packageJson___peerDependencies___version'
  | 'pluginCreator___packageJson___keywords'
  | 'pluginCreatorId'
  | 'componentPath';

export type SitePageFilterInput = {
  path?: Maybe<StringQueryOperatorInput>;
  component?: Maybe<StringQueryOperatorInput>;
  internalComponentName?: Maybe<StringQueryOperatorInput>;
  componentChunkName?: Maybe<StringQueryOperatorInput>;
  matchPath?: Maybe<StringQueryOperatorInput>;
  socialLinks?: Maybe<SocialLinksFilterInput>;
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
  isCreatedByStatefulCreatePages?: Maybe<BooleanQueryOperatorInput>;
  pluginCreator?: Maybe<SitePluginFilterInput>;
  pluginCreatorId?: Maybe<StringQueryOperatorInput>;
  componentPath?: Maybe<StringQueryOperatorInput>;
};

export type SitePageGroupConnection = {
  totalCount: Scalars['Int'];
  edges: Array<SitePageEdge>;
  nodes: Array<SitePage>;
  pageInfo: PageInfo;
  field: Scalars['String'];
  fieldValue?: Maybe<Scalars['String']>;
};

export type SitePageSortInput = {
  fields?: Maybe<Array<Maybe<SitePageFieldsEnum>>>;
  order?: Maybe<Array<Maybe<SortOrderEnum>>>;
};

export type SitePlugin = Node & {
  id: Scalars['ID'];
  parent?: Maybe<Node>;
  children: Array<Node>;
  internal: Internal;
  resolve?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
  pluginOptions?: Maybe<SitePluginPluginOptions>;
  nodeAPIs?: Maybe<Array<Maybe<Scalars['String']>>>;
  browserAPIs?: Maybe<Array<Maybe<Scalars['String']>>>;
  ssrAPIs?: Maybe<Array<Maybe<Scalars['String']>>>;
  pluginFilepath?: Maybe<Scalars['String']>;
  packageJson?: Maybe<SitePluginPackageJson>;
};

export type SitePluginConnection = {
  totalCount: Scalars['Int'];
  edges: Array<SitePluginEdge>;
  nodes: Array<SitePlugin>;
  pageInfo: PageInfo;
  distinct: Array<Scalars['String']>;
  group: Array<SitePluginGroupConnection>;
};


export type SitePluginConnectionDistinctArgs = {
  field: SitePluginFieldsEnum;
};


export type SitePluginConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  field: SitePluginFieldsEnum;
};

export type SitePluginEdge = {
  next?: Maybe<SitePlugin>;
  node: SitePlugin;
  previous?: Maybe<SitePlugin>;
};

export type SitePluginFieldsEnum = 
  | 'id'
  | 'parent___id'
  | 'parent___parent___id'
  | 'parent___parent___parent___id'
  | 'parent___parent___parent___children'
  | 'parent___parent___children'
  | 'parent___parent___children___id'
  | 'parent___parent___children___children'
  | 'parent___parent___internal___content'
  | 'parent___parent___internal___contentDigest'
  | 'parent___parent___internal___description'
  | 'parent___parent___internal___fieldOwners'
  | 'parent___parent___internal___ignoreType'
  | 'parent___parent___internal___mediaType'
  | 'parent___parent___internal___owner'
  | 'parent___parent___internal___type'
  | 'parent___children'
  | 'parent___children___id'
  | 'parent___children___parent___id'
  | 'parent___children___parent___children'
  | 'parent___children___children'
  | 'parent___children___children___id'
  | 'parent___children___children___children'
  | 'parent___children___internal___content'
  | 'parent___children___internal___contentDigest'
  | 'parent___children___internal___description'
  | 'parent___children___internal___fieldOwners'
  | 'parent___children___internal___ignoreType'
  | 'parent___children___internal___mediaType'
  | 'parent___children___internal___owner'
  | 'parent___children___internal___type'
  | 'parent___internal___content'
  | 'parent___internal___contentDigest'
  | 'parent___internal___description'
  | 'parent___internal___fieldOwners'
  | 'parent___internal___ignoreType'
  | 'parent___internal___mediaType'
  | 'parent___internal___owner'
  | 'parent___internal___type'
  | 'children'
  | 'children___id'
  | 'children___parent___id'
  | 'children___parent___parent___id'
  | 'children___parent___parent___children'
  | 'children___parent___children'
  | 'children___parent___children___id'
  | 'children___parent___children___children'
  | 'children___parent___internal___content'
  | 'children___parent___internal___contentDigest'
  | 'children___parent___internal___description'
  | 'children___parent___internal___fieldOwners'
  | 'children___parent___internal___ignoreType'
  | 'children___parent___internal___mediaType'
  | 'children___parent___internal___owner'
  | 'children___parent___internal___type'
  | 'children___children'
  | 'children___children___id'
  | 'children___children___parent___id'
  | 'children___children___parent___children'
  | 'children___children___children'
  | 'children___children___children___id'
  | 'children___children___children___children'
  | 'children___children___internal___content'
  | 'children___children___internal___contentDigest'
  | 'children___children___internal___description'
  | 'children___children___internal___fieldOwners'
  | 'children___children___internal___ignoreType'
  | 'children___children___internal___mediaType'
  | 'children___children___internal___owner'
  | 'children___children___internal___type'
  | 'children___internal___content'
  | 'children___internal___contentDigest'
  | 'children___internal___description'
  | 'children___internal___fieldOwners'
  | 'children___internal___ignoreType'
  | 'children___internal___mediaType'
  | 'children___internal___owner'
  | 'children___internal___type'
  | 'internal___content'
  | 'internal___contentDigest'
  | 'internal___description'
  | 'internal___fieldOwners'
  | 'internal___ignoreType'
  | 'internal___mediaType'
  | 'internal___owner'
  | 'internal___type'
  | 'resolve'
  | 'name'
  | 'version'
  | 'pluginOptions___extensions'
  | 'pluginOptions___commonmark'
  | 'pluginOptions___gatsbyRemarkPlugins'
  | 'pluginOptions___gatsbyRemarkPlugins___resolve'
  | 'pluginOptions___gatsbyRemarkPlugins___options___icon'
  | 'pluginOptions___gatsbyRemarkPlugins___options___className'
  | 'pluginOptions___gatsbyRemarkPlugins___options___stripBrackets'
  | 'pluginOptions___gatsbyRemarkPlugins___options___maxWidth'
  | 'pluginOptions___gatsbyRemarkPlugins___options___linkImagesToOriginal'
  | 'pluginOptions___gatsbyRemarkPlugins___options___injectStyles'
  | 'pluginOptions___gatsbyRemarkPlugins___options___default'
  | 'pluginOptions___gatsbyRemarkPlugins___options___extensions'
  | 'pluginOptions___defaultLayouts___posts'
  | 'pluginOptions___defaultLayouts___speaking'
  | 'pluginOptions___defaultLayouts___notes'
  | 'pluginOptions___path'
  | 'pluginOptions___name'
  | 'pluginOptions___contentPath'
  | 'pluginOptions___pluginMdxOptions___extensions'
  | 'pluginOptions___pluginMdxOptions___commonmark'
  | 'pluginOptions___pluginMdxOptions___gatsbyRemarkPlugins'
  | 'pluginOptions___pluginMdxOptions___gatsbyRemarkPlugins___resolve'
  | 'pluginOptions___pluginMdxOptions___defaultLayouts___posts'
  | 'pluginOptions___pluginMdxOptions___defaultLayouts___speaking'
  | 'pluginOptions___pluginMdxOptions___defaultLayouts___notes'
  | 'pluginOptions___markdownReferences___contentPath'
  | 'pluginOptions___markdownReferences___pluginMdxOptions___extensions'
  | 'pluginOptions___markdownReferences___pluginMdxOptions___commonmark'
  | 'pluginOptions___markdownReferences___pluginMdxOptions___gatsbyRemarkPlugins'
  | 'pluginOptions___base64Width'
  | 'pluginOptions___stripMetadata'
  | 'pluginOptions___defaultQuality'
  | 'pluginOptions___failOnError'
  | 'pluginOptions___allowNamespaces'
  | 'pluginOptions___isTSX'
  | 'pluginOptions___jsxPragma'
  | 'pluginOptions___allExtensions'
  | 'pluginOptions___documentPaths'
  | 'pluginOptions___localSchemaFile'
  | 'pluginOptions___output'
  | 'pluginOptions___includes'
  | 'pluginOptions___short_name'
  | 'pluginOptions___start_url'
  | 'pluginOptions___background_color'
  | 'pluginOptions___theme_color'
  | 'pluginOptions___icon'
  | 'pluginOptions___legacy'
  | 'pluginOptions___theme_color_in_head'
  | 'pluginOptions___cache_busting_mode'
  | 'pluginOptions___crossOrigin'
  | 'pluginOptions___include_favicon'
  | 'pluginOptions___cacheDigest'
  | 'pluginOptions___exclude'
  | 'pluginOptions___createLinkInHead'
  | 'pluginOptions___query'
  | 'pluginOptions___feeds'
  | 'pluginOptions___feeds___query'
  | 'pluginOptions___feeds___output'
  | 'pluginOptions___feeds___title'
  | 'pluginOptions___pathCheck'
  | 'nodeAPIs'
  | 'browserAPIs'
  | 'ssrAPIs'
  | 'pluginFilepath'
  | 'packageJson___name'
  | 'packageJson___description'
  | 'packageJson___version'
  | 'packageJson___main'
  | 'packageJson___author'
  | 'packageJson___license'
  | 'packageJson___dependencies'
  | 'packageJson___dependencies___name'
  | 'packageJson___dependencies___version'
  | 'packageJson___devDependencies'
  | 'packageJson___devDependencies___name'
  | 'packageJson___devDependencies___version'
  | 'packageJson___peerDependencies'
  | 'packageJson___peerDependencies___name'
  | 'packageJson___peerDependencies___version'
  | 'packageJson___keywords';

export type SitePluginFilterInput = {
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
  resolve?: Maybe<StringQueryOperatorInput>;
  name?: Maybe<StringQueryOperatorInput>;
  version?: Maybe<StringQueryOperatorInput>;
  pluginOptions?: Maybe<SitePluginPluginOptionsFilterInput>;
  nodeAPIs?: Maybe<StringQueryOperatorInput>;
  browserAPIs?: Maybe<StringQueryOperatorInput>;
  ssrAPIs?: Maybe<StringQueryOperatorInput>;
  pluginFilepath?: Maybe<StringQueryOperatorInput>;
  packageJson?: Maybe<SitePluginPackageJsonFilterInput>;
};

export type SitePluginGroupConnection = {
  totalCount: Scalars['Int'];
  edges: Array<SitePluginEdge>;
  nodes: Array<SitePlugin>;
  pageInfo: PageInfo;
  field: Scalars['String'];
  fieldValue?: Maybe<Scalars['String']>;
};

export type SitePluginPackageJson = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
  main?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  license?: Maybe<Scalars['String']>;
  dependencies?: Maybe<Array<Maybe<SitePluginPackageJsonDependencies>>>;
  devDependencies?: Maybe<Array<Maybe<SitePluginPackageJsonDevDependencies>>>;
  peerDependencies?: Maybe<Array<Maybe<SitePluginPackageJsonPeerDependencies>>>;
  keywords?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type SitePluginPackageJsonDependencies = {
  name?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
};

export type SitePluginPackageJsonDependenciesFilterInput = {
  name?: Maybe<StringQueryOperatorInput>;
  version?: Maybe<StringQueryOperatorInput>;
};

export type SitePluginPackageJsonDependenciesFilterListInput = {
  elemMatch?: Maybe<SitePluginPackageJsonDependenciesFilterInput>;
};

export type SitePluginPackageJsonDevDependencies = {
  name?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
};

export type SitePluginPackageJsonDevDependenciesFilterInput = {
  name?: Maybe<StringQueryOperatorInput>;
  version?: Maybe<StringQueryOperatorInput>;
};

export type SitePluginPackageJsonDevDependenciesFilterListInput = {
  elemMatch?: Maybe<SitePluginPackageJsonDevDependenciesFilterInput>;
};

export type SitePluginPackageJsonFilterInput = {
  name?: Maybe<StringQueryOperatorInput>;
  description?: Maybe<StringQueryOperatorInput>;
  version?: Maybe<StringQueryOperatorInput>;
  main?: Maybe<StringQueryOperatorInput>;
  author?: Maybe<StringQueryOperatorInput>;
  license?: Maybe<StringQueryOperatorInput>;
  dependencies?: Maybe<SitePluginPackageJsonDependenciesFilterListInput>;
  devDependencies?: Maybe<SitePluginPackageJsonDevDependenciesFilterListInput>;
  peerDependencies?: Maybe<SitePluginPackageJsonPeerDependenciesFilterListInput>;
  keywords?: Maybe<StringQueryOperatorInput>;
};

export type SitePluginPackageJsonPeerDependencies = {
  name?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
};

export type SitePluginPackageJsonPeerDependenciesFilterInput = {
  name?: Maybe<StringQueryOperatorInput>;
  version?: Maybe<StringQueryOperatorInput>;
};

export type SitePluginPackageJsonPeerDependenciesFilterListInput = {
  elemMatch?: Maybe<SitePluginPackageJsonPeerDependenciesFilterInput>;
};

export type SitePluginPluginOptions = {
  extensions?: Maybe<Array<Maybe<Scalars['String']>>>;
  commonmark?: Maybe<Scalars['Boolean']>;
  gatsbyRemarkPlugins?: Maybe<Array<Maybe<SitePluginPluginOptionsGatsbyRemarkPlugins>>>;
  defaultLayouts?: Maybe<SitePluginPluginOptionsDefaultLayouts>;
  path?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  contentPath?: Maybe<Scalars['String']>;
  pluginMdxOptions?: Maybe<SitePluginPluginOptionsPluginMdxOptions>;
  markdownReferences?: Maybe<SitePluginPluginOptionsMarkdownReferences>;
  base64Width?: Maybe<Scalars['Int']>;
  stripMetadata?: Maybe<Scalars['Boolean']>;
  defaultQuality?: Maybe<Scalars['Int']>;
  failOnError?: Maybe<Scalars['Boolean']>;
  allowNamespaces?: Maybe<Scalars['Boolean']>;
  isTSX?: Maybe<Scalars['Boolean']>;
  jsxPragma?: Maybe<Scalars['String']>;
  allExtensions?: Maybe<Scalars['Boolean']>;
  documentPaths?: Maybe<Array<Maybe<Scalars['String']>>>;
  localSchemaFile?: Maybe<Scalars['String']>;
  output?: Maybe<Scalars['String']>;
  includes?: Maybe<Array<Maybe<Scalars['String']>>>;
  short_name?: Maybe<Scalars['String']>;
  start_url?: Maybe<Scalars['String']>;
  background_color?: Maybe<Scalars['String']>;
  theme_color?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  legacy?: Maybe<Scalars['Boolean']>;
  theme_color_in_head?: Maybe<Scalars['Boolean']>;
  cache_busting_mode?: Maybe<Scalars['String']>;
  crossOrigin?: Maybe<Scalars['String']>;
  include_favicon?: Maybe<Scalars['Boolean']>;
  cacheDigest?: Maybe<Scalars['String']>;
  exclude?: Maybe<Array<Maybe<Scalars['String']>>>;
  createLinkInHead?: Maybe<Scalars['Boolean']>;
  query?: Maybe<Scalars['String']>;
  feeds?: Maybe<Array<Maybe<SitePluginPluginOptionsFeeds>>>;
  pathCheck?: Maybe<Scalars['Boolean']>;
};

export type SitePluginPluginOptionsDefaultLayouts = {
  posts?: Maybe<Scalars['String']>;
  speaking?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
};

export type SitePluginPluginOptionsDefaultLayoutsFilterInput = {
  posts?: Maybe<StringQueryOperatorInput>;
  speaking?: Maybe<StringQueryOperatorInput>;
  notes?: Maybe<StringQueryOperatorInput>;
};

export type SitePluginPluginOptionsFeeds = {
  query?: Maybe<Scalars['String']>;
  output?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type SitePluginPluginOptionsFeedsFilterInput = {
  query?: Maybe<StringQueryOperatorInput>;
  output?: Maybe<StringQueryOperatorInput>;
  title?: Maybe<StringQueryOperatorInput>;
};

export type SitePluginPluginOptionsFeedsFilterListInput = {
  elemMatch?: Maybe<SitePluginPluginOptionsFeedsFilterInput>;
};

export type SitePluginPluginOptionsFilterInput = {
  extensions?: Maybe<StringQueryOperatorInput>;
  commonmark?: Maybe<BooleanQueryOperatorInput>;
  gatsbyRemarkPlugins?: Maybe<SitePluginPluginOptionsGatsbyRemarkPluginsFilterListInput>;
  defaultLayouts?: Maybe<SitePluginPluginOptionsDefaultLayoutsFilterInput>;
  path?: Maybe<StringQueryOperatorInput>;
  name?: Maybe<StringQueryOperatorInput>;
  contentPath?: Maybe<StringQueryOperatorInput>;
  pluginMdxOptions?: Maybe<SitePluginPluginOptionsPluginMdxOptionsFilterInput>;
  markdownReferences?: Maybe<SitePluginPluginOptionsMarkdownReferencesFilterInput>;
  base64Width?: Maybe<IntQueryOperatorInput>;
  stripMetadata?: Maybe<BooleanQueryOperatorInput>;
  defaultQuality?: Maybe<IntQueryOperatorInput>;
  failOnError?: Maybe<BooleanQueryOperatorInput>;
  allowNamespaces?: Maybe<BooleanQueryOperatorInput>;
  isTSX?: Maybe<BooleanQueryOperatorInput>;
  jsxPragma?: Maybe<StringQueryOperatorInput>;
  allExtensions?: Maybe<BooleanQueryOperatorInput>;
  documentPaths?: Maybe<StringQueryOperatorInput>;
  localSchemaFile?: Maybe<StringQueryOperatorInput>;
  output?: Maybe<StringQueryOperatorInput>;
  includes?: Maybe<StringQueryOperatorInput>;
  short_name?: Maybe<StringQueryOperatorInput>;
  start_url?: Maybe<StringQueryOperatorInput>;
  background_color?: Maybe<StringQueryOperatorInput>;
  theme_color?: Maybe<StringQueryOperatorInput>;
  icon?: Maybe<StringQueryOperatorInput>;
  legacy?: Maybe<BooleanQueryOperatorInput>;
  theme_color_in_head?: Maybe<BooleanQueryOperatorInput>;
  cache_busting_mode?: Maybe<StringQueryOperatorInput>;
  crossOrigin?: Maybe<StringQueryOperatorInput>;
  include_favicon?: Maybe<BooleanQueryOperatorInput>;
  cacheDigest?: Maybe<StringQueryOperatorInput>;
  exclude?: Maybe<StringQueryOperatorInput>;
  createLinkInHead?: Maybe<BooleanQueryOperatorInput>;
  query?: Maybe<StringQueryOperatorInput>;
  feeds?: Maybe<SitePluginPluginOptionsFeedsFilterListInput>;
  pathCheck?: Maybe<BooleanQueryOperatorInput>;
};

export type SitePluginPluginOptionsGatsbyRemarkPlugins = {
  resolve?: Maybe<Scalars['String']>;
  options?: Maybe<SitePluginPluginOptionsGatsbyRemarkPluginsOptions>;
};

export type SitePluginPluginOptionsGatsbyRemarkPluginsFilterInput = {
  resolve?: Maybe<StringQueryOperatorInput>;
  options?: Maybe<SitePluginPluginOptionsGatsbyRemarkPluginsOptionsFilterInput>;
};

export type SitePluginPluginOptionsGatsbyRemarkPluginsFilterListInput = {
  elemMatch?: Maybe<SitePluginPluginOptionsGatsbyRemarkPluginsFilterInput>;
};

export type SitePluginPluginOptionsGatsbyRemarkPluginsOptions = {
  icon?: Maybe<Scalars['String']>;
  className?: Maybe<Scalars['String']>;
  stripBrackets?: Maybe<Scalars['Boolean']>;
  titleToURL?: Maybe<SitePluginPluginOptionsGatsbyRemarkPluginsOptionsTitleToUrl>;
  maxWidth?: Maybe<Scalars['Int']>;
  linkImagesToOriginal?: Maybe<Scalars['Boolean']>;
  injectStyles?: Maybe<Scalars['Boolean']>;
  default?: Maybe<Scalars['String']>;
  extensions?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type SitePluginPluginOptionsGatsbyRemarkPluginsOptionsFilterInput = {
  icon?: Maybe<StringQueryOperatorInput>;
  className?: Maybe<StringQueryOperatorInput>;
  stripBrackets?: Maybe<BooleanQueryOperatorInput>;
  titleToURL?: Maybe<SitePluginPluginOptionsGatsbyRemarkPluginsOptionsTitleToUrlFilterInput>;
  maxWidth?: Maybe<IntQueryOperatorInput>;
  linkImagesToOriginal?: Maybe<BooleanQueryOperatorInput>;
  injectStyles?: Maybe<BooleanQueryOperatorInput>;
  default?: Maybe<StringQueryOperatorInput>;
  extensions?: Maybe<StringQueryOperatorInput>;
};

export type SitePluginPluginOptionsGatsbyRemarkPluginsOptionsTitleToUrl = {
  prefix?: Maybe<Scalars['String']>;
};

export type SitePluginPluginOptionsGatsbyRemarkPluginsOptionsTitleToUrlFilterInput = {
  prefix?: Maybe<StringQueryOperatorInput>;
};

export type SitePluginPluginOptionsMarkdownReferences = {
  contentPath?: Maybe<Scalars['String']>;
  pluginMdxOptions?: Maybe<SitePluginPluginOptionsMarkdownReferencesPluginMdxOptions>;
};

export type SitePluginPluginOptionsMarkdownReferencesFilterInput = {
  contentPath?: Maybe<StringQueryOperatorInput>;
  pluginMdxOptions?: Maybe<SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsFilterInput>;
};

export type SitePluginPluginOptionsMarkdownReferencesPluginMdxOptions = {
  extensions?: Maybe<Array<Maybe<Scalars['String']>>>;
  commonmark?: Maybe<Scalars['Boolean']>;
  gatsbyRemarkPlugins?: Maybe<Array<Maybe<SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsGatsbyRemarkPlugins>>>;
  defaultLayouts?: Maybe<SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsDefaultLayouts>;
};

export type SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsDefaultLayouts = {
  posts?: Maybe<Scalars['String']>;
  speaking?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
};

export type SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsDefaultLayoutsFilterInput = {
  posts?: Maybe<StringQueryOperatorInput>;
  speaking?: Maybe<StringQueryOperatorInput>;
  notes?: Maybe<StringQueryOperatorInput>;
};

export type SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsFilterInput = {
  extensions?: Maybe<StringQueryOperatorInput>;
  commonmark?: Maybe<BooleanQueryOperatorInput>;
  gatsbyRemarkPlugins?: Maybe<SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsGatsbyRemarkPluginsFilterListInput>;
  defaultLayouts?: Maybe<SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsDefaultLayoutsFilterInput>;
};

export type SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsGatsbyRemarkPlugins = {
  resolve?: Maybe<Scalars['String']>;
  options?: Maybe<SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsGatsbyRemarkPluginsOptions>;
};

export type SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsGatsbyRemarkPluginsFilterInput = {
  resolve?: Maybe<StringQueryOperatorInput>;
  options?: Maybe<SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsGatsbyRemarkPluginsOptionsFilterInput>;
};

export type SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsGatsbyRemarkPluginsFilterListInput = {
  elemMatch?: Maybe<SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsGatsbyRemarkPluginsFilterInput>;
};

export type SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsGatsbyRemarkPluginsOptions = {
  icon?: Maybe<Scalars['String']>;
  className?: Maybe<Scalars['String']>;
  stripBrackets?: Maybe<Scalars['Boolean']>;
  titleToURL?: Maybe<SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsGatsbyRemarkPluginsOptionsTitleToUrl>;
  maxWidth?: Maybe<Scalars['Int']>;
  linkImagesToOriginal?: Maybe<Scalars['Boolean']>;
  injectStyles?: Maybe<Scalars['Boolean']>;
  default?: Maybe<Scalars['String']>;
  extensions?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsGatsbyRemarkPluginsOptionsFilterInput = {
  icon?: Maybe<StringQueryOperatorInput>;
  className?: Maybe<StringQueryOperatorInput>;
  stripBrackets?: Maybe<BooleanQueryOperatorInput>;
  titleToURL?: Maybe<SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsGatsbyRemarkPluginsOptionsTitleToUrlFilterInput>;
  maxWidth?: Maybe<IntQueryOperatorInput>;
  linkImagesToOriginal?: Maybe<BooleanQueryOperatorInput>;
  injectStyles?: Maybe<BooleanQueryOperatorInput>;
  default?: Maybe<StringQueryOperatorInput>;
  extensions?: Maybe<StringQueryOperatorInput>;
};

export type SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsGatsbyRemarkPluginsOptionsTitleToUrl = {
  prefix?: Maybe<Scalars['String']>;
};

export type SitePluginPluginOptionsMarkdownReferencesPluginMdxOptionsGatsbyRemarkPluginsOptionsTitleToUrlFilterInput = {
  prefix?: Maybe<StringQueryOperatorInput>;
};

export type SitePluginPluginOptionsPluginMdxOptions = {
  extensions?: Maybe<Array<Maybe<Scalars['String']>>>;
  commonmark?: Maybe<Scalars['Boolean']>;
  gatsbyRemarkPlugins?: Maybe<Array<Maybe<SitePluginPluginOptionsPluginMdxOptionsGatsbyRemarkPlugins>>>;
  defaultLayouts?: Maybe<SitePluginPluginOptionsPluginMdxOptionsDefaultLayouts>;
};

export type SitePluginPluginOptionsPluginMdxOptionsDefaultLayouts = {
  posts?: Maybe<Scalars['String']>;
  speaking?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
};

export type SitePluginPluginOptionsPluginMdxOptionsDefaultLayoutsFilterInput = {
  posts?: Maybe<StringQueryOperatorInput>;
  speaking?: Maybe<StringQueryOperatorInput>;
  notes?: Maybe<StringQueryOperatorInput>;
};

export type SitePluginPluginOptionsPluginMdxOptionsFilterInput = {
  extensions?: Maybe<StringQueryOperatorInput>;
  commonmark?: Maybe<BooleanQueryOperatorInput>;
  gatsbyRemarkPlugins?: Maybe<SitePluginPluginOptionsPluginMdxOptionsGatsbyRemarkPluginsFilterListInput>;
  defaultLayouts?: Maybe<SitePluginPluginOptionsPluginMdxOptionsDefaultLayoutsFilterInput>;
};

export type SitePluginPluginOptionsPluginMdxOptionsGatsbyRemarkPlugins = {
  resolve?: Maybe<Scalars['String']>;
  options?: Maybe<SitePluginPluginOptionsPluginMdxOptionsGatsbyRemarkPluginsOptions>;
};

export type SitePluginPluginOptionsPluginMdxOptionsGatsbyRemarkPluginsFilterInput = {
  resolve?: Maybe<StringQueryOperatorInput>;
  options?: Maybe<SitePluginPluginOptionsPluginMdxOptionsGatsbyRemarkPluginsOptionsFilterInput>;
};

export type SitePluginPluginOptionsPluginMdxOptionsGatsbyRemarkPluginsFilterListInput = {
  elemMatch?: Maybe<SitePluginPluginOptionsPluginMdxOptionsGatsbyRemarkPluginsFilterInput>;
};

export type SitePluginPluginOptionsPluginMdxOptionsGatsbyRemarkPluginsOptions = {
  icon?: Maybe<Scalars['String']>;
  className?: Maybe<Scalars['String']>;
  stripBrackets?: Maybe<Scalars['Boolean']>;
  titleToURL?: Maybe<SitePluginPluginOptionsPluginMdxOptionsGatsbyRemarkPluginsOptionsTitleToUrl>;
  maxWidth?: Maybe<Scalars['Int']>;
  linkImagesToOriginal?: Maybe<Scalars['Boolean']>;
  injectStyles?: Maybe<Scalars['Boolean']>;
  default?: Maybe<Scalars['String']>;
  extensions?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type SitePluginPluginOptionsPluginMdxOptionsGatsbyRemarkPluginsOptionsFilterInput = {
  icon?: Maybe<StringQueryOperatorInput>;
  className?: Maybe<StringQueryOperatorInput>;
  stripBrackets?: Maybe<BooleanQueryOperatorInput>;
  titleToURL?: Maybe<SitePluginPluginOptionsPluginMdxOptionsGatsbyRemarkPluginsOptionsTitleToUrlFilterInput>;
  maxWidth?: Maybe<IntQueryOperatorInput>;
  linkImagesToOriginal?: Maybe<BooleanQueryOperatorInput>;
  injectStyles?: Maybe<BooleanQueryOperatorInput>;
  default?: Maybe<StringQueryOperatorInput>;
  extensions?: Maybe<StringQueryOperatorInput>;
};

export type SitePluginPluginOptionsPluginMdxOptionsGatsbyRemarkPluginsOptionsTitleToUrl = {
  prefix?: Maybe<Scalars['String']>;
};

export type SitePluginPluginOptionsPluginMdxOptionsGatsbyRemarkPluginsOptionsTitleToUrlFilterInput = {
  prefix?: Maybe<StringQueryOperatorInput>;
};

export type SitePluginSortInput = {
  fields?: Maybe<Array<Maybe<SitePluginFieldsEnum>>>;
  order?: Maybe<Array<Maybe<SortOrderEnum>>>;
};

export type SiteSiteMetadata = {
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  titleTemplate?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  social?: Maybe<Array<Maybe<SiteSiteMetadataSocial>>>;
  siteUrl?: Maybe<Scalars['String']>;
  htmlAttributes?: Maybe<SiteSiteMetadataHtmlAttributes>;
  twitterUsername?: Maybe<Scalars['String']>;
};

export type SiteSiteMetadataFilterInput = {
  title?: Maybe<StringQueryOperatorInput>;
  description?: Maybe<StringQueryOperatorInput>;
  titleTemplate?: Maybe<StringQueryOperatorInput>;
  author?: Maybe<StringQueryOperatorInput>;
  social?: Maybe<SiteSiteMetadataSocialFilterListInput>;
  siteUrl?: Maybe<StringQueryOperatorInput>;
  htmlAttributes?: Maybe<SiteSiteMetadataHtmlAttributesFilterInput>;
  twitterUsername?: Maybe<StringQueryOperatorInput>;
};

export type SiteSiteMetadataHtmlAttributes = {
  lang?: Maybe<Scalars['String']>;
};

export type SiteSiteMetadataHtmlAttributesFilterInput = {
  lang?: Maybe<StringQueryOperatorInput>;
};

export type SiteSiteMetadataSocial = {
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type SiteSiteMetadataSocialFilterInput = {
  name?: Maybe<StringQueryOperatorInput>;
  url?: Maybe<StringQueryOperatorInput>;
};

export type SiteSiteMetadataSocialFilterListInput = {
  elemMatch?: Maybe<SiteSiteMetadataSocialFilterInput>;
};

export type SiteSortInput = {
  fields?: Maybe<Array<Maybe<SiteFieldsEnum>>>;
  order?: Maybe<Array<Maybe<SortOrderEnum>>>;
};

export type SocialLinks = {
  edit: Scalars['String'];
  tweet: Scalars['String'];
  discuss: Scalars['String'];
};

export type SocialLinksFilterInput = {
  edit?: Maybe<StringQueryOperatorInput>;
  tweet?: Maybe<StringQueryOperatorInput>;
  discuss?: Maybe<StringQueryOperatorInput>;
};

export type SortOrderEnum = 
  | 'ASC'
  | 'DESC';

export type StringQueryOperatorInput = {
  eq?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['String']>;
  glob?: Maybe<Scalars['String']>;
};

export type TableOfContents = {
  items?: Maybe<Array<TableOfContentsItem>>;
};

export type TableOfContentsFilterInput = {
  items?: Maybe<TableOfContentsItemFilterListInput>;
};

export type TableOfContentsItem = {
  url?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  items?: Maybe<Array<TableOfContentsItem>>;
};

export type TableOfContentsItemFilterInput = {
  url?: Maybe<StringQueryOperatorInput>;
  title?: Maybe<StringQueryOperatorInput>;
  items?: Maybe<TableOfContentsItemFilterListInput>;
};

export type TableOfContentsItemFilterListInput = {
  elemMatch?: Maybe<TableOfContentsItemFilterInput>;
};

export type ThemeUiConfig = Node & {
  preset?: Maybe<Scalars['JSON']>;
  prismPreset?: Maybe<Scalars['JSON']>;
  id: Scalars['ID'];
  parent?: Maybe<Node>;
  children: Array<Node>;
  internal: Internal;
};

export type ThemeUiConfigConnection = {
  totalCount: Scalars['Int'];
  edges: Array<ThemeUiConfigEdge>;
  nodes: Array<ThemeUiConfig>;
  pageInfo: PageInfo;
  distinct: Array<Scalars['String']>;
  group: Array<ThemeUiConfigGroupConnection>;
};


export type ThemeUiConfigConnectionDistinctArgs = {
  field: ThemeUiConfigFieldsEnum;
};


export type ThemeUiConfigConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  field: ThemeUiConfigFieldsEnum;
};

export type ThemeUiConfigEdge = {
  next?: Maybe<ThemeUiConfig>;
  node: ThemeUiConfig;
  previous?: Maybe<ThemeUiConfig>;
};

export type ThemeUiConfigFieldsEnum = 
  | 'preset'
  | 'prismPreset'
  | 'id'
  | 'parent___id'
  | 'parent___parent___id'
  | 'parent___parent___parent___id'
  | 'parent___parent___parent___children'
  | 'parent___parent___children'
  | 'parent___parent___children___id'
  | 'parent___parent___children___children'
  | 'parent___parent___internal___content'
  | 'parent___parent___internal___contentDigest'
  | 'parent___parent___internal___description'
  | 'parent___parent___internal___fieldOwners'
  | 'parent___parent___internal___ignoreType'
  | 'parent___parent___internal___mediaType'
  | 'parent___parent___internal___owner'
  | 'parent___parent___internal___type'
  | 'parent___children'
  | 'parent___children___id'
  | 'parent___children___parent___id'
  | 'parent___children___parent___children'
  | 'parent___children___children'
  | 'parent___children___children___id'
  | 'parent___children___children___children'
  | 'parent___children___internal___content'
  | 'parent___children___internal___contentDigest'
  | 'parent___children___internal___description'
  | 'parent___children___internal___fieldOwners'
  | 'parent___children___internal___ignoreType'
  | 'parent___children___internal___mediaType'
  | 'parent___children___internal___owner'
  | 'parent___children___internal___type'
  | 'parent___internal___content'
  | 'parent___internal___contentDigest'
  | 'parent___internal___description'
  | 'parent___internal___fieldOwners'
  | 'parent___internal___ignoreType'
  | 'parent___internal___mediaType'
  | 'parent___internal___owner'
  | 'parent___internal___type'
  | 'children'
  | 'children___id'
  | 'children___parent___id'
  | 'children___parent___parent___id'
  | 'children___parent___parent___children'
  | 'children___parent___children'
  | 'children___parent___children___id'
  | 'children___parent___children___children'
  | 'children___parent___internal___content'
  | 'children___parent___internal___contentDigest'
  | 'children___parent___internal___description'
  | 'children___parent___internal___fieldOwners'
  | 'children___parent___internal___ignoreType'
  | 'children___parent___internal___mediaType'
  | 'children___parent___internal___owner'
  | 'children___parent___internal___type'
  | 'children___children'
  | 'children___children___id'
  | 'children___children___parent___id'
  | 'children___children___parent___children'
  | 'children___children___children'
  | 'children___children___children___id'
  | 'children___children___children___children'
  | 'children___children___internal___content'
  | 'children___children___internal___contentDigest'
  | 'children___children___internal___description'
  | 'children___children___internal___fieldOwners'
  | 'children___children___internal___ignoreType'
  | 'children___children___internal___mediaType'
  | 'children___children___internal___owner'
  | 'children___children___internal___type'
  | 'children___internal___content'
  | 'children___internal___contentDigest'
  | 'children___internal___description'
  | 'children___internal___fieldOwners'
  | 'children___internal___ignoreType'
  | 'children___internal___mediaType'
  | 'children___internal___owner'
  | 'children___internal___type'
  | 'internal___content'
  | 'internal___contentDigest'
  | 'internal___description'
  | 'internal___fieldOwners'
  | 'internal___ignoreType'
  | 'internal___mediaType'
  | 'internal___owner'
  | 'internal___type';

export type ThemeUiConfigFilterInput = {
  preset?: Maybe<JsonQueryOperatorInput>;
  prismPreset?: Maybe<JsonQueryOperatorInput>;
  id?: Maybe<StringQueryOperatorInput>;
  parent?: Maybe<NodeFilterInput>;
  children?: Maybe<NodeFilterListInput>;
  internal?: Maybe<InternalFilterInput>;
};

export type ThemeUiConfigGroupConnection = {
  totalCount: Scalars['Int'];
  edges: Array<ThemeUiConfigEdge>;
  nodes: Array<ThemeUiConfig>;
  pageInfo: PageInfo;
  field: Scalars['String'];
  fieldValue?: Maybe<Scalars['String']>;
};

export type ThemeUiConfigSortInput = {
  fields?: Maybe<Array<Maybe<ThemeUiConfigFieldsEnum>>>;
  order?: Maybe<Array<Maybe<SortOrderEnum>>>;
};

export type TransformOptions = {
  grayscale?: Maybe<Scalars['Boolean']>;
  duotone?: Maybe<DuotoneGradient>;
  rotate?: Maybe<Scalars['Int']>;
  trim?: Maybe<Scalars['Float']>;
  cropFocus?: Maybe<ImageCropFocus>;
  fit?: Maybe<ImageFit>;
};

export type Venue = {
  name: Scalars['String'];
  link?: Maybe<Scalars['String']>;
};

export type VenueFilterInput = {
  name?: Maybe<StringQueryOperatorInput>;
  link?: Maybe<StringQueryOperatorInput>;
};

export type VenueFilterListInput = {
  elemMatch?: Maybe<VenueFilterInput>;
};

export type WebPOptions = {
  quality?: Maybe<Scalars['Int']>;
};

export type GraphOverviewNotesQueryVariables = Exact<{ [key: string]: never; }>;


export type GraphOverviewNotesQuery = { allFile: { nodes: Array<{ childMdx?: Maybe<{ fields?: Maybe<Pick<MdxFields, 'title' | 'route'>>, outboundReferences: Array<{ fields?: Maybe<Pick<MdxFields, 'route'>> }> }> }> } };

export type Unnamed_1_QueryVariables = Exact<{ [key: string]: never; }>;


export type Unnamed_1_Query = { allFile: { nodes: Array<(
      Pick<File, 'id' | 'absolutePath' | 'sourceInstanceName' | 'ext'>
      & { internal: Pick<Internal, 'mediaType'>, childMdx?: Maybe<(
        { fields?: Maybe<Pick<MdxFields, 'title' | 'route'>>, frontmatter?: Maybe<Pick<MdxFrontmatter, 'isHidden'>> }
        & GatsbyGardenReferencesOnMdxFragment
        & TweetDiscussEditLinksDataOnMdxFragment
      )> }
    )> } };

export type GatsbyGardenReferencesOnMdxFragment = { outboundReferences: Array<(
    Pick<Mdx, 'excerpt'>
    & { fields?: Maybe<Pick<MdxFields, 'title' | 'route'>> }
  )>, inboundReferences: Array<(
    Pick<InboundReference, 'paragraph'>
    & { node: { fields?: Maybe<Pick<MdxFields, 'title' | 'route'>> } }
  )> };

export type LastContributionsQueryVariables = Exact<{ [key: string]: never; }>;


export type LastContributionsQuery = { allGhContributions: { nodes: Array<{ mergedRepositories: Array<Pick<GhRepository, 'nameWithOwner'>> }> } };

export type SeoDataQueryVariables = Exact<{ [key: string]: never; }>;


export type SeoDataQuery = { site?: Maybe<{ siteMetadata?: Maybe<(
      Pick<SiteSiteMetadata, 'titleTemplate' | 'siteUrl' | 'twitterUsername'>
      & { defaultTitle: SiteSiteMetadata['title'], defaultDescription: SiteSiteMetadata['description'] }
      & { htmlAttributes?: Maybe<Pick<SiteSiteMetadataHtmlAttributes, 'lang'>> }
    )> }> };

export type TweetDiscussEditLinksDataOnSitePageFragment = { socialLinks: Pick<SocialLinks, 'edit' | 'tweet'> };

export type TweetDiscussEditLinksDataOnMdxFragment = { socialLinks: Pick<SocialLinks, 'edit' | 'tweet'> };

export type PostTitleAndRouteFragment = { nodes: Array<{ childMdx?: Maybe<{ parent?: Maybe<Pick<File, 'sourceInstanceName'>>, frontmatter?: Maybe<Pick<MdxFrontmatter, 'date' | 'title'>>, fields?: Maybe<Pick<MdxFields, 'route' | 'title'>> }> }> };

export type IndexPageQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type IndexPageQueryQuery = { favorites: PostTitleAndRouteFragment };

export type GetNotesIndexQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNotesIndexQuery = { allFile: { nodes: Array<{ childMdx?: Maybe<{ fields?: Maybe<(
          Pick<MdxFields, 'title' | 'route'>
          & { history?: Maybe<(
            Pick<BlogpostHistory, 'url'>
            & { entries: Array<Pick<BlogpostHistoryEntry, 'subject' | 'authorDate' | 'abbreviatedCommit'>> }
          )>, socialImage?: Maybe<{ childImageSharp?: Maybe<{ original?: Maybe<Pick<ImageSharpOriginal, 'width' | 'height' | 'src'>> }> }> }
        )> }> }> } };

export type GetSpeakingRaportsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpeakingRaportsQuery = { allMdx: { nodes: Array<{ frontmatter?: Maybe<(
        Pick<MdxFrontmatter, 'title' | 'spoiler' | 'date'>
        & { venues?: Maybe<Array<Pick<Venue, 'name' | 'link'>>> }
      )>, fields?: Maybe<Pick<MdxFields, 'route'>> }> } };

export type GetBlogPostDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBlogPostDataQuery = { allMdx: { nodes: Array<{ frontmatter?: Maybe<Pick<MdxFrontmatter, 'title' | 'spoiler' | 'date'>>, fields?: Maybe<Pick<MdxFields, 'route' | 'readingTime'>> }> } };
