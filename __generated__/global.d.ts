export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Date: any,
  JSON: any,
};

export type BlogpostHistory = {
  readonly __typename?: 'BlogpostHistory',
  readonly entries: ReadonlyArray<BlogpostHistoryEntry>,
  readonly url: Scalars['String'],
};

export type BlogpostHistoryEntry = {
  readonly __typename?: 'BlogpostHistoryEntry',
  readonly abbreviatedCommit?: Maybe<Scalars['String']>,
  readonly authorDate: Scalars['Date'],
  readonly subject?: Maybe<Scalars['String']>,
  readonly body?: Maybe<Scalars['String']>,
};

export type BlogpostHistoryEntryFilterInput = {
  readonly abbreviatedCommit?: Maybe<StringQueryOperatorInput>,
  readonly authorDate?: Maybe<DateQueryOperatorInput>,
  readonly subject?: Maybe<StringQueryOperatorInput>,
  readonly body?: Maybe<StringQueryOperatorInput>,
};

export type BlogpostHistoryEntryFilterListInput = {
  readonly elemMatch?: Maybe<BlogpostHistoryEntryFilterInput>,
};

export type BlogpostHistoryFilterInput = {
  readonly entries?: Maybe<BlogpostHistoryEntryFilterListInput>,
  readonly url?: Maybe<StringQueryOperatorInput>,
};

export enum BlogpostHistoryType {
  Verbose = 'Verbose',
  DatesOnly = 'DatesOnly'
}

export type BlogpostHistoryTypeQueryOperatorInput = {
  readonly eq?: Maybe<BlogpostHistoryType>,
  readonly ne?: Maybe<BlogpostHistoryType>,
  readonly in?: Maybe<ReadonlyArray<Maybe<BlogpostHistoryType>>>,
  readonly nin?: Maybe<ReadonlyArray<Maybe<BlogpostHistoryType>>>,
};

export type BooleanQueryOperatorInput = {
  readonly eq?: Maybe<Scalars['Boolean']>,
  readonly ne?: Maybe<Scalars['Boolean']>,
  readonly in?: Maybe<ReadonlyArray<Maybe<Scalars['Boolean']>>>,
  readonly nin?: Maybe<ReadonlyArray<Maybe<Scalars['Boolean']>>>,
};


export type DateQueryOperatorInput = {
  readonly eq?: Maybe<Scalars['Date']>,
  readonly ne?: Maybe<Scalars['Date']>,
  readonly gt?: Maybe<Scalars['Date']>,
  readonly gte?: Maybe<Scalars['Date']>,
  readonly lt?: Maybe<Scalars['Date']>,
  readonly lte?: Maybe<Scalars['Date']>,
  readonly in?: Maybe<ReadonlyArray<Maybe<Scalars['Date']>>>,
  readonly nin?: Maybe<ReadonlyArray<Maybe<Scalars['Date']>>>,
};

export type Directory = Node & {
  readonly __typename?: 'Directory',
  readonly sourceInstanceName: Scalars['String'],
  readonly absolutePath: Scalars['String'],
  readonly relativePath: Scalars['String'],
  readonly extension: Scalars['String'],
  readonly size: Scalars['Int'],
  readonly prettySize: Scalars['String'],
  readonly modifiedTime: Scalars['Date'],
  readonly accessTime: Scalars['Date'],
  readonly changeTime: Scalars['Date'],
  readonly birthTime: Scalars['Date'],
  readonly root: Scalars['String'],
  readonly dir: Scalars['String'],
  readonly base: Scalars['String'],
  readonly ext: Scalars['String'],
  readonly name: Scalars['String'],
  readonly relativeDirectory: Scalars['String'],
  readonly dev: Scalars['Int'],
  readonly mode: Scalars['Int'],
  readonly nlink: Scalars['Int'],
  readonly uid: Scalars['Int'],
  readonly gid: Scalars['Int'],
  readonly rdev: Scalars['Int'],
  readonly ino: Scalars['Float'],
  readonly atimeMs: Scalars['Float'],
  readonly mtimeMs: Scalars['Float'],
  readonly ctimeMs: Scalars['Float'],
  readonly atime: Scalars['Date'],
  readonly mtime: Scalars['Date'],
  readonly ctime: Scalars['Date'],
  readonly birthtime?: Maybe<Scalars['Date']>,
  readonly birthtimeMs?: Maybe<Scalars['Float']>,
  readonly blksize?: Maybe<Scalars['Int']>,
  readonly blocks?: Maybe<Scalars['Int']>,
  readonly id: Scalars['ID'],
  readonly parent?: Maybe<Node>,
  readonly children: ReadonlyArray<Node>,
  readonly internal: Internal,
};


export type DirectorymodifiedTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type DirectoryaccessTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type DirectorychangeTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type DirectorybirthTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type DirectoryatimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type DirectorymtimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type DirectoryctimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};

export type DirectoryConnection = {
  readonly __typename?: 'DirectoryConnection',
  readonly totalCount: Scalars['Int'],
  readonly edges: ReadonlyArray<DirectoryEdge>,
  readonly nodes: ReadonlyArray<Directory>,
  readonly pageInfo: PageInfo,
  readonly distinct: ReadonlyArray<Scalars['String']>,
  readonly group: ReadonlyArray<DirectoryGroupConnection>,
};


export type DirectoryConnectiondistinctArgs = {
  field: DirectoryFieldsEnum
};


export type DirectoryConnectiongroupArgs = {
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  field: DirectoryFieldsEnum
};

export type DirectoryEdge = {
  readonly __typename?: 'DirectoryEdge',
  readonly next?: Maybe<Directory>,
  readonly node: Directory,
  readonly previous?: Maybe<Directory>,
};

export enum DirectoryFieldsEnum {
  sourceInstanceName = 'sourceInstanceName',
  absolutePath = 'absolutePath',
  relativePath = 'relativePath',
  extension = 'extension',
  size = 'size',
  prettySize = 'prettySize',
  modifiedTime = 'modifiedTime',
  accessTime = 'accessTime',
  changeTime = 'changeTime',
  birthTime = 'birthTime',
  root = 'root',
  dir = 'dir',
  base = 'base',
  ext = 'ext',
  name = 'name',
  relativeDirectory = 'relativeDirectory',
  dev = 'dev',
  mode = 'mode',
  nlink = 'nlink',
  uid = 'uid',
  gid = 'gid',
  rdev = 'rdev',
  ino = 'ino',
  atimeMs = 'atimeMs',
  mtimeMs = 'mtimeMs',
  ctimeMs = 'ctimeMs',
  atime = 'atime',
  mtime = 'mtime',
  ctime = 'ctime',
  birthtime = 'birthtime',
  birthtimeMs = 'birthtimeMs',
  blksize = 'blksize',
  blocks = 'blocks',
  id = 'id',
  parent___id = 'parent___id',
  parent___parent___id = 'parent___parent___id',
  parent___parent___parent___id = 'parent___parent___parent___id',
  parent___parent___parent___children = 'parent___parent___parent___children',
  parent___parent___children = 'parent___parent___children',
  parent___parent___children___id = 'parent___parent___children___id',
  parent___parent___children___children = 'parent___parent___children___children',
  parent___parent___internal___content = 'parent___parent___internal___content',
  parent___parent___internal___contentDigest = 'parent___parent___internal___contentDigest',
  parent___parent___internal___description = 'parent___parent___internal___description',
  parent___parent___internal___fieldOwners = 'parent___parent___internal___fieldOwners',
  parent___parent___internal___ignoreType = 'parent___parent___internal___ignoreType',
  parent___parent___internal___mediaType = 'parent___parent___internal___mediaType',
  parent___parent___internal___owner = 'parent___parent___internal___owner',
  parent___parent___internal___type = 'parent___parent___internal___type',
  parent___children = 'parent___children',
  parent___children___id = 'parent___children___id',
  parent___children___parent___id = 'parent___children___parent___id',
  parent___children___parent___children = 'parent___children___parent___children',
  parent___children___children = 'parent___children___children',
  parent___children___children___id = 'parent___children___children___id',
  parent___children___children___children = 'parent___children___children___children',
  parent___children___internal___content = 'parent___children___internal___content',
  parent___children___internal___contentDigest = 'parent___children___internal___contentDigest',
  parent___children___internal___description = 'parent___children___internal___description',
  parent___children___internal___fieldOwners = 'parent___children___internal___fieldOwners',
  parent___children___internal___ignoreType = 'parent___children___internal___ignoreType',
  parent___children___internal___mediaType = 'parent___children___internal___mediaType',
  parent___children___internal___owner = 'parent___children___internal___owner',
  parent___children___internal___type = 'parent___children___internal___type',
  parent___internal___content = 'parent___internal___content',
  parent___internal___contentDigest = 'parent___internal___contentDigest',
  parent___internal___description = 'parent___internal___description',
  parent___internal___fieldOwners = 'parent___internal___fieldOwners',
  parent___internal___ignoreType = 'parent___internal___ignoreType',
  parent___internal___mediaType = 'parent___internal___mediaType',
  parent___internal___owner = 'parent___internal___owner',
  parent___internal___type = 'parent___internal___type',
  children = 'children',
  children___id = 'children___id',
  children___parent___id = 'children___parent___id',
  children___parent___parent___id = 'children___parent___parent___id',
  children___parent___parent___children = 'children___parent___parent___children',
  children___parent___children = 'children___parent___children',
  children___parent___children___id = 'children___parent___children___id',
  children___parent___children___children = 'children___parent___children___children',
  children___parent___internal___content = 'children___parent___internal___content',
  children___parent___internal___contentDigest = 'children___parent___internal___contentDigest',
  children___parent___internal___description = 'children___parent___internal___description',
  children___parent___internal___fieldOwners = 'children___parent___internal___fieldOwners',
  children___parent___internal___ignoreType = 'children___parent___internal___ignoreType',
  children___parent___internal___mediaType = 'children___parent___internal___mediaType',
  children___parent___internal___owner = 'children___parent___internal___owner',
  children___parent___internal___type = 'children___parent___internal___type',
  children___children = 'children___children',
  children___children___id = 'children___children___id',
  children___children___parent___id = 'children___children___parent___id',
  children___children___parent___children = 'children___children___parent___children',
  children___children___children = 'children___children___children',
  children___children___children___id = 'children___children___children___id',
  children___children___children___children = 'children___children___children___children',
  children___children___internal___content = 'children___children___internal___content',
  children___children___internal___contentDigest = 'children___children___internal___contentDigest',
  children___children___internal___description = 'children___children___internal___description',
  children___children___internal___fieldOwners = 'children___children___internal___fieldOwners',
  children___children___internal___ignoreType = 'children___children___internal___ignoreType',
  children___children___internal___mediaType = 'children___children___internal___mediaType',
  children___children___internal___owner = 'children___children___internal___owner',
  children___children___internal___type = 'children___children___internal___type',
  children___internal___content = 'children___internal___content',
  children___internal___contentDigest = 'children___internal___contentDigest',
  children___internal___description = 'children___internal___description',
  children___internal___fieldOwners = 'children___internal___fieldOwners',
  children___internal___ignoreType = 'children___internal___ignoreType',
  children___internal___mediaType = 'children___internal___mediaType',
  children___internal___owner = 'children___internal___owner',
  children___internal___type = 'children___internal___type',
  internal___content = 'internal___content',
  internal___contentDigest = 'internal___contentDigest',
  internal___description = 'internal___description',
  internal___fieldOwners = 'internal___fieldOwners',
  internal___ignoreType = 'internal___ignoreType',
  internal___mediaType = 'internal___mediaType',
  internal___owner = 'internal___owner',
  internal___type = 'internal___type'
}

export type DirectoryFilterInput = {
  readonly sourceInstanceName?: Maybe<StringQueryOperatorInput>,
  readonly absolutePath?: Maybe<StringQueryOperatorInput>,
  readonly relativePath?: Maybe<StringQueryOperatorInput>,
  readonly extension?: Maybe<StringQueryOperatorInput>,
  readonly size?: Maybe<IntQueryOperatorInput>,
  readonly prettySize?: Maybe<StringQueryOperatorInput>,
  readonly modifiedTime?: Maybe<DateQueryOperatorInput>,
  readonly accessTime?: Maybe<DateQueryOperatorInput>,
  readonly changeTime?: Maybe<DateQueryOperatorInput>,
  readonly birthTime?: Maybe<DateQueryOperatorInput>,
  readonly root?: Maybe<StringQueryOperatorInput>,
  readonly dir?: Maybe<StringQueryOperatorInput>,
  readonly base?: Maybe<StringQueryOperatorInput>,
  readonly ext?: Maybe<StringQueryOperatorInput>,
  readonly name?: Maybe<StringQueryOperatorInput>,
  readonly relativeDirectory?: Maybe<StringQueryOperatorInput>,
  readonly dev?: Maybe<IntQueryOperatorInput>,
  readonly mode?: Maybe<IntQueryOperatorInput>,
  readonly nlink?: Maybe<IntQueryOperatorInput>,
  readonly uid?: Maybe<IntQueryOperatorInput>,
  readonly gid?: Maybe<IntQueryOperatorInput>,
  readonly rdev?: Maybe<IntQueryOperatorInput>,
  readonly ino?: Maybe<FloatQueryOperatorInput>,
  readonly atimeMs?: Maybe<FloatQueryOperatorInput>,
  readonly mtimeMs?: Maybe<FloatQueryOperatorInput>,
  readonly ctimeMs?: Maybe<FloatQueryOperatorInput>,
  readonly atime?: Maybe<DateQueryOperatorInput>,
  readonly mtime?: Maybe<DateQueryOperatorInput>,
  readonly ctime?: Maybe<DateQueryOperatorInput>,
  readonly birthtime?: Maybe<DateQueryOperatorInput>,
  readonly birthtimeMs?: Maybe<FloatQueryOperatorInput>,
  readonly blksize?: Maybe<IntQueryOperatorInput>,
  readonly blocks?: Maybe<IntQueryOperatorInput>,
  readonly id?: Maybe<StringQueryOperatorInput>,
  readonly parent?: Maybe<NodeFilterInput>,
  readonly children?: Maybe<NodeFilterListInput>,
  readonly internal?: Maybe<InternalFilterInput>,
};

export type DirectoryGroupConnection = {
  readonly __typename?: 'DirectoryGroupConnection',
  readonly totalCount: Scalars['Int'],
  readonly edges: ReadonlyArray<DirectoryEdge>,
  readonly nodes: ReadonlyArray<Directory>,
  readonly pageInfo: PageInfo,
  readonly field: Scalars['String'],
  readonly fieldValue?: Maybe<Scalars['String']>,
};

export type DirectorySortInput = {
  readonly fields?: Maybe<ReadonlyArray<Maybe<DirectoryFieldsEnum>>>,
  readonly order?: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>,
};

export type DuotoneGradient = {
  readonly highlight: Scalars['String'],
  readonly shadow: Scalars['String'],
  readonly opacity?: Maybe<Scalars['Int']>,
};

export type File = Node & {
  readonly __typename?: 'File',
  readonly sourceInstanceName: Scalars['String'],
  readonly absolutePath: Scalars['String'],
  readonly relativePath: Scalars['String'],
  readonly extension: Scalars['String'],
  readonly size: Scalars['Int'],
  readonly prettySize: Scalars['String'],
  readonly modifiedTime: Scalars['Date'],
  readonly accessTime: Scalars['Date'],
  readonly changeTime: Scalars['Date'],
  readonly birthTime: Scalars['Date'],
  readonly root: Scalars['String'],
  readonly dir: Scalars['String'],
  readonly base: Scalars['String'],
  readonly ext: Scalars['String'],
  readonly name: Scalars['String'],
  readonly relativeDirectory: Scalars['String'],
  readonly dev: Scalars['Int'],
  readonly mode: Scalars['Int'],
  readonly nlink: Scalars['Int'],
  readonly uid: Scalars['Int'],
  readonly gid: Scalars['Int'],
  readonly rdev: Scalars['Int'],
  readonly ino: Scalars['Float'],
  readonly atimeMs: Scalars['Float'],
  readonly mtimeMs: Scalars['Float'],
  readonly ctimeMs: Scalars['Float'],
  readonly atime: Scalars['Date'],
  readonly mtime: Scalars['Date'],
  readonly ctime: Scalars['Date'],
  readonly birthtime?: Maybe<Scalars['Date']>,
  readonly birthtimeMs?: Maybe<Scalars['Float']>,
  readonly blksize?: Maybe<Scalars['Int']>,
  readonly blocks?: Maybe<Scalars['Int']>,
  /** Copy file to static directory and return public url to it */
  readonly publicURL?: Maybe<Scalars['String']>,
  readonly childImageSharp?: Maybe<ImageSharp>,
  readonly id: Scalars['ID'],
  readonly parent?: Maybe<Node>,
  readonly children: ReadonlyArray<Node>,
  readonly internal: Internal,
  readonly childMdx?: Maybe<Mdx>,
};


export type FilemodifiedTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type FileaccessTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type FilechangeTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type FilebirthTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type FileatimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type FilemtimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type FilectimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};

export type FileConnection = {
  readonly __typename?: 'FileConnection',
  readonly totalCount: Scalars['Int'],
  readonly edges: ReadonlyArray<FileEdge>,
  readonly nodes: ReadonlyArray<File>,
  readonly pageInfo: PageInfo,
  readonly distinct: ReadonlyArray<Scalars['String']>,
  readonly group: ReadonlyArray<FileGroupConnection>,
};


export type FileConnectiondistinctArgs = {
  field: FileFieldsEnum
};


export type FileConnectiongroupArgs = {
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  field: FileFieldsEnum
};

export type FileEdge = {
  readonly __typename?: 'FileEdge',
  readonly next?: Maybe<File>,
  readonly node: File,
  readonly previous?: Maybe<File>,
};

export enum FileFieldsEnum {
  sourceInstanceName = 'sourceInstanceName',
  absolutePath = 'absolutePath',
  relativePath = 'relativePath',
  extension = 'extension',
  size = 'size',
  prettySize = 'prettySize',
  modifiedTime = 'modifiedTime',
  accessTime = 'accessTime',
  changeTime = 'changeTime',
  birthTime = 'birthTime',
  root = 'root',
  dir = 'dir',
  base = 'base',
  ext = 'ext',
  name = 'name',
  relativeDirectory = 'relativeDirectory',
  dev = 'dev',
  mode = 'mode',
  nlink = 'nlink',
  uid = 'uid',
  gid = 'gid',
  rdev = 'rdev',
  ino = 'ino',
  atimeMs = 'atimeMs',
  mtimeMs = 'mtimeMs',
  ctimeMs = 'ctimeMs',
  atime = 'atime',
  mtime = 'mtime',
  ctime = 'ctime',
  birthtime = 'birthtime',
  birthtimeMs = 'birthtimeMs',
  blksize = 'blksize',
  blocks = 'blocks',
  publicURL = 'publicURL',
  childImageSharp___fixed___base64 = 'childImageSharp___fixed___base64',
  childImageSharp___fixed___tracedSVG = 'childImageSharp___fixed___tracedSVG',
  childImageSharp___fixed___aspectRatio = 'childImageSharp___fixed___aspectRatio',
  childImageSharp___fixed___width = 'childImageSharp___fixed___width',
  childImageSharp___fixed___height = 'childImageSharp___fixed___height',
  childImageSharp___fixed___src = 'childImageSharp___fixed___src',
  childImageSharp___fixed___srcSet = 'childImageSharp___fixed___srcSet',
  childImageSharp___fixed___srcWebp = 'childImageSharp___fixed___srcWebp',
  childImageSharp___fixed___srcSetWebp = 'childImageSharp___fixed___srcSetWebp',
  childImageSharp___fixed___originalName = 'childImageSharp___fixed___originalName',
  childImageSharp___resolutions___base64 = 'childImageSharp___resolutions___base64',
  childImageSharp___resolutions___tracedSVG = 'childImageSharp___resolutions___tracedSVG',
  childImageSharp___resolutions___aspectRatio = 'childImageSharp___resolutions___aspectRatio',
  childImageSharp___resolutions___width = 'childImageSharp___resolutions___width',
  childImageSharp___resolutions___height = 'childImageSharp___resolutions___height',
  childImageSharp___resolutions___src = 'childImageSharp___resolutions___src',
  childImageSharp___resolutions___srcSet = 'childImageSharp___resolutions___srcSet',
  childImageSharp___resolutions___srcWebp = 'childImageSharp___resolutions___srcWebp',
  childImageSharp___resolutions___srcSetWebp = 'childImageSharp___resolutions___srcSetWebp',
  childImageSharp___resolutions___originalName = 'childImageSharp___resolutions___originalName',
  childImageSharp___fluid___base64 = 'childImageSharp___fluid___base64',
  childImageSharp___fluid___tracedSVG = 'childImageSharp___fluid___tracedSVG',
  childImageSharp___fluid___aspectRatio = 'childImageSharp___fluid___aspectRatio',
  childImageSharp___fluid___src = 'childImageSharp___fluid___src',
  childImageSharp___fluid___srcSet = 'childImageSharp___fluid___srcSet',
  childImageSharp___fluid___srcWebp = 'childImageSharp___fluid___srcWebp',
  childImageSharp___fluid___srcSetWebp = 'childImageSharp___fluid___srcSetWebp',
  childImageSharp___fluid___sizes = 'childImageSharp___fluid___sizes',
  childImageSharp___fluid___originalImg = 'childImageSharp___fluid___originalImg',
  childImageSharp___fluid___originalName = 'childImageSharp___fluid___originalName',
  childImageSharp___fluid___presentationWidth = 'childImageSharp___fluid___presentationWidth',
  childImageSharp___fluid___presentationHeight = 'childImageSharp___fluid___presentationHeight',
  childImageSharp___sizes___base64 = 'childImageSharp___sizes___base64',
  childImageSharp___sizes___tracedSVG = 'childImageSharp___sizes___tracedSVG',
  childImageSharp___sizes___aspectRatio = 'childImageSharp___sizes___aspectRatio',
  childImageSharp___sizes___src = 'childImageSharp___sizes___src',
  childImageSharp___sizes___srcSet = 'childImageSharp___sizes___srcSet',
  childImageSharp___sizes___srcWebp = 'childImageSharp___sizes___srcWebp',
  childImageSharp___sizes___srcSetWebp = 'childImageSharp___sizes___srcSetWebp',
  childImageSharp___sizes___sizes = 'childImageSharp___sizes___sizes',
  childImageSharp___sizes___originalImg = 'childImageSharp___sizes___originalImg',
  childImageSharp___sizes___originalName = 'childImageSharp___sizes___originalName',
  childImageSharp___sizes___presentationWidth = 'childImageSharp___sizes___presentationWidth',
  childImageSharp___sizes___presentationHeight = 'childImageSharp___sizes___presentationHeight',
  childImageSharp___original___width = 'childImageSharp___original___width',
  childImageSharp___original___height = 'childImageSharp___original___height',
  childImageSharp___original___src = 'childImageSharp___original___src',
  childImageSharp___resize___src = 'childImageSharp___resize___src',
  childImageSharp___resize___tracedSVG = 'childImageSharp___resize___tracedSVG',
  childImageSharp___resize___width = 'childImageSharp___resize___width',
  childImageSharp___resize___height = 'childImageSharp___resize___height',
  childImageSharp___resize___aspectRatio = 'childImageSharp___resize___aspectRatio',
  childImageSharp___resize___originalName = 'childImageSharp___resize___originalName',
  childImageSharp___id = 'childImageSharp___id',
  childImageSharp___parent___id = 'childImageSharp___parent___id',
  childImageSharp___parent___parent___id = 'childImageSharp___parent___parent___id',
  childImageSharp___parent___parent___children = 'childImageSharp___parent___parent___children',
  childImageSharp___parent___children = 'childImageSharp___parent___children',
  childImageSharp___parent___children___id = 'childImageSharp___parent___children___id',
  childImageSharp___parent___children___children = 'childImageSharp___parent___children___children',
  childImageSharp___parent___internal___content = 'childImageSharp___parent___internal___content',
  childImageSharp___parent___internal___contentDigest = 'childImageSharp___parent___internal___contentDigest',
  childImageSharp___parent___internal___description = 'childImageSharp___parent___internal___description',
  childImageSharp___parent___internal___fieldOwners = 'childImageSharp___parent___internal___fieldOwners',
  childImageSharp___parent___internal___ignoreType = 'childImageSharp___parent___internal___ignoreType',
  childImageSharp___parent___internal___mediaType = 'childImageSharp___parent___internal___mediaType',
  childImageSharp___parent___internal___owner = 'childImageSharp___parent___internal___owner',
  childImageSharp___parent___internal___type = 'childImageSharp___parent___internal___type',
  childImageSharp___children = 'childImageSharp___children',
  childImageSharp___children___id = 'childImageSharp___children___id',
  childImageSharp___children___parent___id = 'childImageSharp___children___parent___id',
  childImageSharp___children___parent___children = 'childImageSharp___children___parent___children',
  childImageSharp___children___children = 'childImageSharp___children___children',
  childImageSharp___children___children___id = 'childImageSharp___children___children___id',
  childImageSharp___children___children___children = 'childImageSharp___children___children___children',
  childImageSharp___children___internal___content = 'childImageSharp___children___internal___content',
  childImageSharp___children___internal___contentDigest = 'childImageSharp___children___internal___contentDigest',
  childImageSharp___children___internal___description = 'childImageSharp___children___internal___description',
  childImageSharp___children___internal___fieldOwners = 'childImageSharp___children___internal___fieldOwners',
  childImageSharp___children___internal___ignoreType = 'childImageSharp___children___internal___ignoreType',
  childImageSharp___children___internal___mediaType = 'childImageSharp___children___internal___mediaType',
  childImageSharp___children___internal___owner = 'childImageSharp___children___internal___owner',
  childImageSharp___children___internal___type = 'childImageSharp___children___internal___type',
  childImageSharp___internal___content = 'childImageSharp___internal___content',
  childImageSharp___internal___contentDigest = 'childImageSharp___internal___contentDigest',
  childImageSharp___internal___description = 'childImageSharp___internal___description',
  childImageSharp___internal___fieldOwners = 'childImageSharp___internal___fieldOwners',
  childImageSharp___internal___ignoreType = 'childImageSharp___internal___ignoreType',
  childImageSharp___internal___mediaType = 'childImageSharp___internal___mediaType',
  childImageSharp___internal___owner = 'childImageSharp___internal___owner',
  childImageSharp___internal___type = 'childImageSharp___internal___type',
  id = 'id',
  parent___id = 'parent___id',
  parent___parent___id = 'parent___parent___id',
  parent___parent___parent___id = 'parent___parent___parent___id',
  parent___parent___parent___children = 'parent___parent___parent___children',
  parent___parent___children = 'parent___parent___children',
  parent___parent___children___id = 'parent___parent___children___id',
  parent___parent___children___children = 'parent___parent___children___children',
  parent___parent___internal___content = 'parent___parent___internal___content',
  parent___parent___internal___contentDigest = 'parent___parent___internal___contentDigest',
  parent___parent___internal___description = 'parent___parent___internal___description',
  parent___parent___internal___fieldOwners = 'parent___parent___internal___fieldOwners',
  parent___parent___internal___ignoreType = 'parent___parent___internal___ignoreType',
  parent___parent___internal___mediaType = 'parent___parent___internal___mediaType',
  parent___parent___internal___owner = 'parent___parent___internal___owner',
  parent___parent___internal___type = 'parent___parent___internal___type',
  parent___children = 'parent___children',
  parent___children___id = 'parent___children___id',
  parent___children___parent___id = 'parent___children___parent___id',
  parent___children___parent___children = 'parent___children___parent___children',
  parent___children___children = 'parent___children___children',
  parent___children___children___id = 'parent___children___children___id',
  parent___children___children___children = 'parent___children___children___children',
  parent___children___internal___content = 'parent___children___internal___content',
  parent___children___internal___contentDigest = 'parent___children___internal___contentDigest',
  parent___children___internal___description = 'parent___children___internal___description',
  parent___children___internal___fieldOwners = 'parent___children___internal___fieldOwners',
  parent___children___internal___ignoreType = 'parent___children___internal___ignoreType',
  parent___children___internal___mediaType = 'parent___children___internal___mediaType',
  parent___children___internal___owner = 'parent___children___internal___owner',
  parent___children___internal___type = 'parent___children___internal___type',
  parent___internal___content = 'parent___internal___content',
  parent___internal___contentDigest = 'parent___internal___contentDigest',
  parent___internal___description = 'parent___internal___description',
  parent___internal___fieldOwners = 'parent___internal___fieldOwners',
  parent___internal___ignoreType = 'parent___internal___ignoreType',
  parent___internal___mediaType = 'parent___internal___mediaType',
  parent___internal___owner = 'parent___internal___owner',
  parent___internal___type = 'parent___internal___type',
  children = 'children',
  children___id = 'children___id',
  children___parent___id = 'children___parent___id',
  children___parent___parent___id = 'children___parent___parent___id',
  children___parent___parent___children = 'children___parent___parent___children',
  children___parent___children = 'children___parent___children',
  children___parent___children___id = 'children___parent___children___id',
  children___parent___children___children = 'children___parent___children___children',
  children___parent___internal___content = 'children___parent___internal___content',
  children___parent___internal___contentDigest = 'children___parent___internal___contentDigest',
  children___parent___internal___description = 'children___parent___internal___description',
  children___parent___internal___fieldOwners = 'children___parent___internal___fieldOwners',
  children___parent___internal___ignoreType = 'children___parent___internal___ignoreType',
  children___parent___internal___mediaType = 'children___parent___internal___mediaType',
  children___parent___internal___owner = 'children___parent___internal___owner',
  children___parent___internal___type = 'children___parent___internal___type',
  children___children = 'children___children',
  children___children___id = 'children___children___id',
  children___children___parent___id = 'children___children___parent___id',
  children___children___parent___children = 'children___children___parent___children',
  children___children___children = 'children___children___children',
  children___children___children___id = 'children___children___children___id',
  children___children___children___children = 'children___children___children___children',
  children___children___internal___content = 'children___children___internal___content',
  children___children___internal___contentDigest = 'children___children___internal___contentDigest',
  children___children___internal___description = 'children___children___internal___description',
  children___children___internal___fieldOwners = 'children___children___internal___fieldOwners',
  children___children___internal___ignoreType = 'children___children___internal___ignoreType',
  children___children___internal___mediaType = 'children___children___internal___mediaType',
  children___children___internal___owner = 'children___children___internal___owner',
  children___children___internal___type = 'children___children___internal___type',
  children___internal___content = 'children___internal___content',
  children___internal___contentDigest = 'children___internal___contentDigest',
  children___internal___description = 'children___internal___description',
  children___internal___fieldOwners = 'children___internal___fieldOwners',
  children___internal___ignoreType = 'children___internal___ignoreType',
  children___internal___mediaType = 'children___internal___mediaType',
  children___internal___owner = 'children___internal___owner',
  children___internal___type = 'children___internal___type',
  internal___content = 'internal___content',
  internal___contentDigest = 'internal___contentDigest',
  internal___description = 'internal___description',
  internal___fieldOwners = 'internal___fieldOwners',
  internal___ignoreType = 'internal___ignoreType',
  internal___mediaType = 'internal___mediaType',
  internal___owner = 'internal___owner',
  internal___type = 'internal___type',
  childMdx___rawBody = 'childMdx___rawBody',
  childMdx___fileAbsolutePath = 'childMdx___fileAbsolutePath',
  childMdx___frontmatter___title = 'childMdx___frontmatter___title',
  childMdx___frontmatter___spoiler = 'childMdx___frontmatter___spoiler',
  childMdx___frontmatter___date = 'childMdx___frontmatter___date',
  childMdx___frontmatter___history = 'childMdx___frontmatter___history',
  childMdx___frontmatter___historySource = 'childMdx___frontmatter___historySource',
  childMdx___frontmatter___venues = 'childMdx___frontmatter___venues',
  childMdx___frontmatter___venues___name = 'childMdx___frontmatter___venues___name',
  childMdx___frontmatter___venues___link = 'childMdx___frontmatter___venues___link',
  childMdx___body = 'childMdx___body',
  childMdx___excerpt = 'childMdx___excerpt',
  childMdx___headings = 'childMdx___headings',
  childMdx___headings___value = 'childMdx___headings___value',
  childMdx___headings___depth = 'childMdx___headings___depth',
  childMdx___html = 'childMdx___html',
  childMdx___mdxAST = 'childMdx___mdxAST',
  childMdx___tableOfContents = 'childMdx___tableOfContents',
  childMdx___timeToRead = 'childMdx___timeToRead',
  childMdx___wordCount___paragraphs = 'childMdx___wordCount___paragraphs',
  childMdx___wordCount___sentences = 'childMdx___wordCount___sentences',
  childMdx___wordCount___words = 'childMdx___wordCount___words',
  childMdx___fields___route = 'childMdx___fields___route',
  childMdx___fields___isHidden = 'childMdx___fields___isHidden',
  childMdx___fields___history___entries = 'childMdx___fields___history___entries',
  childMdx___fields___history___url = 'childMdx___fields___history___url',
  childMdx___fields___readingTime = 'childMdx___fields___readingTime',
  childMdx___fields___socialImage___sourceInstanceName = 'childMdx___fields___socialImage___sourceInstanceName',
  childMdx___fields___socialImage___absolutePath = 'childMdx___fields___socialImage___absolutePath',
  childMdx___fields___socialImage___relativePath = 'childMdx___fields___socialImage___relativePath',
  childMdx___fields___socialImage___extension = 'childMdx___fields___socialImage___extension',
  childMdx___fields___socialImage___size = 'childMdx___fields___socialImage___size',
  childMdx___fields___socialImage___prettySize = 'childMdx___fields___socialImage___prettySize',
  childMdx___fields___socialImage___modifiedTime = 'childMdx___fields___socialImage___modifiedTime',
  childMdx___fields___socialImage___accessTime = 'childMdx___fields___socialImage___accessTime',
  childMdx___fields___socialImage___changeTime = 'childMdx___fields___socialImage___changeTime',
  childMdx___fields___socialImage___birthTime = 'childMdx___fields___socialImage___birthTime',
  childMdx___fields___socialImage___root = 'childMdx___fields___socialImage___root',
  childMdx___fields___socialImage___dir = 'childMdx___fields___socialImage___dir',
  childMdx___fields___socialImage___base = 'childMdx___fields___socialImage___base',
  childMdx___fields___socialImage___ext = 'childMdx___fields___socialImage___ext',
  childMdx___fields___socialImage___name = 'childMdx___fields___socialImage___name',
  childMdx___fields___socialImage___relativeDirectory = 'childMdx___fields___socialImage___relativeDirectory',
  childMdx___fields___socialImage___dev = 'childMdx___fields___socialImage___dev',
  childMdx___fields___socialImage___mode = 'childMdx___fields___socialImage___mode',
  childMdx___fields___socialImage___nlink = 'childMdx___fields___socialImage___nlink',
  childMdx___fields___socialImage___uid = 'childMdx___fields___socialImage___uid',
  childMdx___fields___socialImage___gid = 'childMdx___fields___socialImage___gid',
  childMdx___fields___socialImage___rdev = 'childMdx___fields___socialImage___rdev',
  childMdx___fields___socialImage___ino = 'childMdx___fields___socialImage___ino',
  childMdx___fields___socialImage___atimeMs = 'childMdx___fields___socialImage___atimeMs',
  childMdx___fields___socialImage___mtimeMs = 'childMdx___fields___socialImage___mtimeMs',
  childMdx___fields___socialImage___ctimeMs = 'childMdx___fields___socialImage___ctimeMs',
  childMdx___fields___socialImage___atime = 'childMdx___fields___socialImage___atime',
  childMdx___fields___socialImage___mtime = 'childMdx___fields___socialImage___mtime',
  childMdx___fields___socialImage___ctime = 'childMdx___fields___socialImage___ctime',
  childMdx___fields___socialImage___birthtime = 'childMdx___fields___socialImage___birthtime',
  childMdx___fields___socialImage___birthtimeMs = 'childMdx___fields___socialImage___birthtimeMs',
  childMdx___fields___socialImage___blksize = 'childMdx___fields___socialImage___blksize',
  childMdx___fields___socialImage___blocks = 'childMdx___fields___socialImage___blocks',
  childMdx___fields___socialImage___publicURL = 'childMdx___fields___socialImage___publicURL',
  childMdx___fields___socialImage___id = 'childMdx___fields___socialImage___id',
  childMdx___fields___socialImage___children = 'childMdx___fields___socialImage___children',
  childMdx___id = 'childMdx___id',
  childMdx___parent___id = 'childMdx___parent___id',
  childMdx___parent___parent___id = 'childMdx___parent___parent___id',
  childMdx___parent___parent___children = 'childMdx___parent___parent___children',
  childMdx___parent___children = 'childMdx___parent___children',
  childMdx___parent___children___id = 'childMdx___parent___children___id',
  childMdx___parent___children___children = 'childMdx___parent___children___children',
  childMdx___parent___internal___content = 'childMdx___parent___internal___content',
  childMdx___parent___internal___contentDigest = 'childMdx___parent___internal___contentDigest',
  childMdx___parent___internal___description = 'childMdx___parent___internal___description',
  childMdx___parent___internal___fieldOwners = 'childMdx___parent___internal___fieldOwners',
  childMdx___parent___internal___ignoreType = 'childMdx___parent___internal___ignoreType',
  childMdx___parent___internal___mediaType = 'childMdx___parent___internal___mediaType',
  childMdx___parent___internal___owner = 'childMdx___parent___internal___owner',
  childMdx___parent___internal___type = 'childMdx___parent___internal___type',
  childMdx___children = 'childMdx___children',
  childMdx___children___id = 'childMdx___children___id',
  childMdx___children___parent___id = 'childMdx___children___parent___id',
  childMdx___children___parent___children = 'childMdx___children___parent___children',
  childMdx___children___children = 'childMdx___children___children',
  childMdx___children___children___id = 'childMdx___children___children___id',
  childMdx___children___children___children = 'childMdx___children___children___children',
  childMdx___children___internal___content = 'childMdx___children___internal___content',
  childMdx___children___internal___contentDigest = 'childMdx___children___internal___contentDigest',
  childMdx___children___internal___description = 'childMdx___children___internal___description',
  childMdx___children___internal___fieldOwners = 'childMdx___children___internal___fieldOwners',
  childMdx___children___internal___ignoreType = 'childMdx___children___internal___ignoreType',
  childMdx___children___internal___mediaType = 'childMdx___children___internal___mediaType',
  childMdx___children___internal___owner = 'childMdx___children___internal___owner',
  childMdx___children___internal___type = 'childMdx___children___internal___type',
  childMdx___internal___content = 'childMdx___internal___content',
  childMdx___internal___contentDigest = 'childMdx___internal___contentDigest',
  childMdx___internal___description = 'childMdx___internal___description',
  childMdx___internal___fieldOwners = 'childMdx___internal___fieldOwners',
  childMdx___internal___ignoreType = 'childMdx___internal___ignoreType',
  childMdx___internal___mediaType = 'childMdx___internal___mediaType',
  childMdx___internal___owner = 'childMdx___internal___owner',
  childMdx___internal___type = 'childMdx___internal___type'
}

export type FileFilterInput = {
  readonly sourceInstanceName?: Maybe<StringQueryOperatorInput>,
  readonly absolutePath?: Maybe<StringQueryOperatorInput>,
  readonly relativePath?: Maybe<StringQueryOperatorInput>,
  readonly extension?: Maybe<StringQueryOperatorInput>,
  readonly size?: Maybe<IntQueryOperatorInput>,
  readonly prettySize?: Maybe<StringQueryOperatorInput>,
  readonly modifiedTime?: Maybe<DateQueryOperatorInput>,
  readonly accessTime?: Maybe<DateQueryOperatorInput>,
  readonly changeTime?: Maybe<DateQueryOperatorInput>,
  readonly birthTime?: Maybe<DateQueryOperatorInput>,
  readonly root?: Maybe<StringQueryOperatorInput>,
  readonly dir?: Maybe<StringQueryOperatorInput>,
  readonly base?: Maybe<StringQueryOperatorInput>,
  readonly ext?: Maybe<StringQueryOperatorInput>,
  readonly name?: Maybe<StringQueryOperatorInput>,
  readonly relativeDirectory?: Maybe<StringQueryOperatorInput>,
  readonly dev?: Maybe<IntQueryOperatorInput>,
  readonly mode?: Maybe<IntQueryOperatorInput>,
  readonly nlink?: Maybe<IntQueryOperatorInput>,
  readonly uid?: Maybe<IntQueryOperatorInput>,
  readonly gid?: Maybe<IntQueryOperatorInput>,
  readonly rdev?: Maybe<IntQueryOperatorInput>,
  readonly ino?: Maybe<FloatQueryOperatorInput>,
  readonly atimeMs?: Maybe<FloatQueryOperatorInput>,
  readonly mtimeMs?: Maybe<FloatQueryOperatorInput>,
  readonly ctimeMs?: Maybe<FloatQueryOperatorInput>,
  readonly atime?: Maybe<DateQueryOperatorInput>,
  readonly mtime?: Maybe<DateQueryOperatorInput>,
  readonly ctime?: Maybe<DateQueryOperatorInput>,
  readonly birthtime?: Maybe<DateQueryOperatorInput>,
  readonly birthtimeMs?: Maybe<FloatQueryOperatorInput>,
  readonly blksize?: Maybe<IntQueryOperatorInput>,
  readonly blocks?: Maybe<IntQueryOperatorInput>,
  readonly publicURL?: Maybe<StringQueryOperatorInput>,
  readonly childImageSharp?: Maybe<ImageSharpFilterInput>,
  readonly id?: Maybe<StringQueryOperatorInput>,
  readonly parent?: Maybe<NodeFilterInput>,
  readonly children?: Maybe<NodeFilterListInput>,
  readonly internal?: Maybe<InternalFilterInput>,
  readonly childMdx?: Maybe<MdxFilterInput>,
};

export type FileGroupConnection = {
  readonly __typename?: 'FileGroupConnection',
  readonly totalCount: Scalars['Int'],
  readonly edges: ReadonlyArray<FileEdge>,
  readonly nodes: ReadonlyArray<File>,
  readonly pageInfo: PageInfo,
  readonly field: Scalars['String'],
  readonly fieldValue?: Maybe<Scalars['String']>,
};

export type FileSortInput = {
  readonly fields?: Maybe<ReadonlyArray<Maybe<FileFieldsEnum>>>,
  readonly order?: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>,
};

export type FloatQueryOperatorInput = {
  readonly eq?: Maybe<Scalars['Float']>,
  readonly ne?: Maybe<Scalars['Float']>,
  readonly gt?: Maybe<Scalars['Float']>,
  readonly gte?: Maybe<Scalars['Float']>,
  readonly lt?: Maybe<Scalars['Float']>,
  readonly lte?: Maybe<Scalars['Float']>,
  readonly in?: Maybe<ReadonlyArray<Maybe<Scalars['Float']>>>,
  readonly nin?: Maybe<ReadonlyArray<Maybe<Scalars['Float']>>>,
};

export enum HeadingsMdx {
  h1 = 'h1',
  h2 = 'h2',
  h3 = 'h3',
  h4 = 'h4',
  h5 = 'h5',
  h6 = 'h6'
}

export enum ImageCropFocus {
  CENTER = 'CENTER',
  NORTH = 'NORTH',
  NORTHEAST = 'NORTHEAST',
  EAST = 'EAST',
  SOUTHEAST = 'SOUTHEAST',
  SOUTH = 'SOUTH',
  SOUTHWEST = 'SOUTHWEST',
  WEST = 'WEST',
  NORTHWEST = 'NORTHWEST',
  ENTROPY = 'ENTROPY',
  ATTENTION = 'ATTENTION'
}

export enum ImageFit {
  COVER = 'COVER',
  CONTAIN = 'CONTAIN',
  FILL = 'FILL'
}

export enum ImageFormat {
  NO_CHANGE = 'NO_CHANGE',
  JPG = 'JPG',
  PNG = 'PNG',
  WEBP = 'WEBP'
}

export type ImageSharp = Node & {
  readonly __typename?: 'ImageSharp',
  readonly fixed?: Maybe<ImageSharpFixed>,
  readonly resolutions?: Maybe<ImageSharpResolutions>,
  readonly fluid?: Maybe<ImageSharpFluid>,
  readonly sizes?: Maybe<ImageSharpSizes>,
  readonly original?: Maybe<ImageSharpOriginal>,
  readonly resize?: Maybe<ImageSharpResize>,
  readonly id: Scalars['ID'],
  readonly parent?: Maybe<Node>,
  readonly children: ReadonlyArray<Node>,
  readonly internal: Internal,
};


export type ImageSharpfixedArgs = {
  width?: Maybe<Scalars['Int']>,
  height?: Maybe<Scalars['Int']>,
  base64Width?: Maybe<Scalars['Int']>,
  jpegProgressive?: Maybe<Scalars['Boolean']>,
  pngCompressionSpeed?: Maybe<Scalars['Int']>,
  grayscale?: Maybe<Scalars['Boolean']>,
  duotone?: Maybe<DuotoneGradient>,
  traceSVG?: Maybe<Potrace>,
  quality?: Maybe<Scalars['Int']>,
  jpegQuality?: Maybe<Scalars['Int']>,
  pngQuality?: Maybe<Scalars['Int']>,
  webpQuality?: Maybe<Scalars['Int']>,
  toFormat?: Maybe<ImageFormat>,
  toFormatBase64?: Maybe<ImageFormat>,
  cropFocus?: Maybe<ImageCropFocus>,
  fit?: Maybe<ImageFit>,
  background?: Maybe<Scalars['String']>,
  rotate?: Maybe<Scalars['Int']>,
  trim?: Maybe<Scalars['Float']>
};


export type ImageSharpresolutionsArgs = {
  width?: Maybe<Scalars['Int']>,
  height?: Maybe<Scalars['Int']>,
  base64Width?: Maybe<Scalars['Int']>,
  jpegProgressive?: Maybe<Scalars['Boolean']>,
  pngCompressionSpeed?: Maybe<Scalars['Int']>,
  grayscale?: Maybe<Scalars['Boolean']>,
  duotone?: Maybe<DuotoneGradient>,
  traceSVG?: Maybe<Potrace>,
  quality?: Maybe<Scalars['Int']>,
  jpegQuality?: Maybe<Scalars['Int']>,
  pngQuality?: Maybe<Scalars['Int']>,
  webpQuality?: Maybe<Scalars['Int']>,
  toFormat?: Maybe<ImageFormat>,
  toFormatBase64?: Maybe<ImageFormat>,
  cropFocus?: Maybe<ImageCropFocus>,
  fit?: Maybe<ImageFit>,
  background?: Maybe<Scalars['String']>,
  rotate?: Maybe<Scalars['Int']>,
  trim?: Maybe<Scalars['Float']>
};


export type ImageSharpfluidArgs = {
  maxWidth?: Maybe<Scalars['Int']>,
  maxHeight?: Maybe<Scalars['Int']>,
  base64Width?: Maybe<Scalars['Int']>,
  grayscale?: Maybe<Scalars['Boolean']>,
  jpegProgressive?: Maybe<Scalars['Boolean']>,
  pngCompressionSpeed?: Maybe<Scalars['Int']>,
  duotone?: Maybe<DuotoneGradient>,
  traceSVG?: Maybe<Potrace>,
  quality?: Maybe<Scalars['Int']>,
  jpegQuality?: Maybe<Scalars['Int']>,
  pngQuality?: Maybe<Scalars['Int']>,
  webpQuality?: Maybe<Scalars['Int']>,
  toFormat?: Maybe<ImageFormat>,
  toFormatBase64?: Maybe<ImageFormat>,
  cropFocus?: Maybe<ImageCropFocus>,
  fit?: Maybe<ImageFit>,
  background?: Maybe<Scalars['String']>,
  rotate?: Maybe<Scalars['Int']>,
  trim?: Maybe<Scalars['Float']>,
  sizes?: Maybe<Scalars['String']>,
  srcSetBreakpoints?: Maybe<ReadonlyArray<Maybe<Scalars['Int']>>>
};


export type ImageSharpsizesArgs = {
  maxWidth?: Maybe<Scalars['Int']>,
  maxHeight?: Maybe<Scalars['Int']>,
  base64Width?: Maybe<Scalars['Int']>,
  grayscale?: Maybe<Scalars['Boolean']>,
  jpegProgressive?: Maybe<Scalars['Boolean']>,
  pngCompressionSpeed?: Maybe<Scalars['Int']>,
  duotone?: Maybe<DuotoneGradient>,
  traceSVG?: Maybe<Potrace>,
  quality?: Maybe<Scalars['Int']>,
  jpegQuality?: Maybe<Scalars['Int']>,
  pngQuality?: Maybe<Scalars['Int']>,
  webpQuality?: Maybe<Scalars['Int']>,
  toFormat?: Maybe<ImageFormat>,
  toFormatBase64?: Maybe<ImageFormat>,
  cropFocus?: Maybe<ImageCropFocus>,
  fit?: Maybe<ImageFit>,
  background?: Maybe<Scalars['String']>,
  rotate?: Maybe<Scalars['Int']>,
  trim?: Maybe<Scalars['Float']>,
  sizes?: Maybe<Scalars['String']>,
  srcSetBreakpoints?: Maybe<ReadonlyArray<Maybe<Scalars['Int']>>>
};


export type ImageSharpresizeArgs = {
  width?: Maybe<Scalars['Int']>,
  height?: Maybe<Scalars['Int']>,
  quality?: Maybe<Scalars['Int']>,
  jpegQuality?: Maybe<Scalars['Int']>,
  pngQuality?: Maybe<Scalars['Int']>,
  webpQuality?: Maybe<Scalars['Int']>,
  jpegProgressive?: Maybe<Scalars['Boolean']>,
  pngCompressionLevel?: Maybe<Scalars['Int']>,
  pngCompressionSpeed?: Maybe<Scalars['Int']>,
  grayscale?: Maybe<Scalars['Boolean']>,
  duotone?: Maybe<DuotoneGradient>,
  base64?: Maybe<Scalars['Boolean']>,
  traceSVG?: Maybe<Potrace>,
  toFormat?: Maybe<ImageFormat>,
  cropFocus?: Maybe<ImageCropFocus>,
  fit?: Maybe<ImageFit>,
  background?: Maybe<Scalars['String']>,
  rotate?: Maybe<Scalars['Int']>,
  trim?: Maybe<Scalars['Float']>
};

export type ImageSharpConnection = {
  readonly __typename?: 'ImageSharpConnection',
  readonly totalCount: Scalars['Int'],
  readonly edges: ReadonlyArray<ImageSharpEdge>,
  readonly nodes: ReadonlyArray<ImageSharp>,
  readonly pageInfo: PageInfo,
  readonly distinct: ReadonlyArray<Scalars['String']>,
  readonly group: ReadonlyArray<ImageSharpGroupConnection>,
};


export type ImageSharpConnectiondistinctArgs = {
  field: ImageSharpFieldsEnum
};


export type ImageSharpConnectiongroupArgs = {
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  field: ImageSharpFieldsEnum
};

export type ImageSharpEdge = {
  readonly __typename?: 'ImageSharpEdge',
  readonly next?: Maybe<ImageSharp>,
  readonly node: ImageSharp,
  readonly previous?: Maybe<ImageSharp>,
};

export enum ImageSharpFieldsEnum {
  fixed___base64 = 'fixed___base64',
  fixed___tracedSVG = 'fixed___tracedSVG',
  fixed___aspectRatio = 'fixed___aspectRatio',
  fixed___width = 'fixed___width',
  fixed___height = 'fixed___height',
  fixed___src = 'fixed___src',
  fixed___srcSet = 'fixed___srcSet',
  fixed___srcWebp = 'fixed___srcWebp',
  fixed___srcSetWebp = 'fixed___srcSetWebp',
  fixed___originalName = 'fixed___originalName',
  resolutions___base64 = 'resolutions___base64',
  resolutions___tracedSVG = 'resolutions___tracedSVG',
  resolutions___aspectRatio = 'resolutions___aspectRatio',
  resolutions___width = 'resolutions___width',
  resolutions___height = 'resolutions___height',
  resolutions___src = 'resolutions___src',
  resolutions___srcSet = 'resolutions___srcSet',
  resolutions___srcWebp = 'resolutions___srcWebp',
  resolutions___srcSetWebp = 'resolutions___srcSetWebp',
  resolutions___originalName = 'resolutions___originalName',
  fluid___base64 = 'fluid___base64',
  fluid___tracedSVG = 'fluid___tracedSVG',
  fluid___aspectRatio = 'fluid___aspectRatio',
  fluid___src = 'fluid___src',
  fluid___srcSet = 'fluid___srcSet',
  fluid___srcWebp = 'fluid___srcWebp',
  fluid___srcSetWebp = 'fluid___srcSetWebp',
  fluid___sizes = 'fluid___sizes',
  fluid___originalImg = 'fluid___originalImg',
  fluid___originalName = 'fluid___originalName',
  fluid___presentationWidth = 'fluid___presentationWidth',
  fluid___presentationHeight = 'fluid___presentationHeight',
  sizes___base64 = 'sizes___base64',
  sizes___tracedSVG = 'sizes___tracedSVG',
  sizes___aspectRatio = 'sizes___aspectRatio',
  sizes___src = 'sizes___src',
  sizes___srcSet = 'sizes___srcSet',
  sizes___srcWebp = 'sizes___srcWebp',
  sizes___srcSetWebp = 'sizes___srcSetWebp',
  sizes___sizes = 'sizes___sizes',
  sizes___originalImg = 'sizes___originalImg',
  sizes___originalName = 'sizes___originalName',
  sizes___presentationWidth = 'sizes___presentationWidth',
  sizes___presentationHeight = 'sizes___presentationHeight',
  original___width = 'original___width',
  original___height = 'original___height',
  original___src = 'original___src',
  resize___src = 'resize___src',
  resize___tracedSVG = 'resize___tracedSVG',
  resize___width = 'resize___width',
  resize___height = 'resize___height',
  resize___aspectRatio = 'resize___aspectRatio',
  resize___originalName = 'resize___originalName',
  id = 'id',
  parent___id = 'parent___id',
  parent___parent___id = 'parent___parent___id',
  parent___parent___parent___id = 'parent___parent___parent___id',
  parent___parent___parent___children = 'parent___parent___parent___children',
  parent___parent___children = 'parent___parent___children',
  parent___parent___children___id = 'parent___parent___children___id',
  parent___parent___children___children = 'parent___parent___children___children',
  parent___parent___internal___content = 'parent___parent___internal___content',
  parent___parent___internal___contentDigest = 'parent___parent___internal___contentDigest',
  parent___parent___internal___description = 'parent___parent___internal___description',
  parent___parent___internal___fieldOwners = 'parent___parent___internal___fieldOwners',
  parent___parent___internal___ignoreType = 'parent___parent___internal___ignoreType',
  parent___parent___internal___mediaType = 'parent___parent___internal___mediaType',
  parent___parent___internal___owner = 'parent___parent___internal___owner',
  parent___parent___internal___type = 'parent___parent___internal___type',
  parent___children = 'parent___children',
  parent___children___id = 'parent___children___id',
  parent___children___parent___id = 'parent___children___parent___id',
  parent___children___parent___children = 'parent___children___parent___children',
  parent___children___children = 'parent___children___children',
  parent___children___children___id = 'parent___children___children___id',
  parent___children___children___children = 'parent___children___children___children',
  parent___children___internal___content = 'parent___children___internal___content',
  parent___children___internal___contentDigest = 'parent___children___internal___contentDigest',
  parent___children___internal___description = 'parent___children___internal___description',
  parent___children___internal___fieldOwners = 'parent___children___internal___fieldOwners',
  parent___children___internal___ignoreType = 'parent___children___internal___ignoreType',
  parent___children___internal___mediaType = 'parent___children___internal___mediaType',
  parent___children___internal___owner = 'parent___children___internal___owner',
  parent___children___internal___type = 'parent___children___internal___type',
  parent___internal___content = 'parent___internal___content',
  parent___internal___contentDigest = 'parent___internal___contentDigest',
  parent___internal___description = 'parent___internal___description',
  parent___internal___fieldOwners = 'parent___internal___fieldOwners',
  parent___internal___ignoreType = 'parent___internal___ignoreType',
  parent___internal___mediaType = 'parent___internal___mediaType',
  parent___internal___owner = 'parent___internal___owner',
  parent___internal___type = 'parent___internal___type',
  children = 'children',
  children___id = 'children___id',
  children___parent___id = 'children___parent___id',
  children___parent___parent___id = 'children___parent___parent___id',
  children___parent___parent___children = 'children___parent___parent___children',
  children___parent___children = 'children___parent___children',
  children___parent___children___id = 'children___parent___children___id',
  children___parent___children___children = 'children___parent___children___children',
  children___parent___internal___content = 'children___parent___internal___content',
  children___parent___internal___contentDigest = 'children___parent___internal___contentDigest',
  children___parent___internal___description = 'children___parent___internal___description',
  children___parent___internal___fieldOwners = 'children___parent___internal___fieldOwners',
  children___parent___internal___ignoreType = 'children___parent___internal___ignoreType',
  children___parent___internal___mediaType = 'children___parent___internal___mediaType',
  children___parent___internal___owner = 'children___parent___internal___owner',
  children___parent___internal___type = 'children___parent___internal___type',
  children___children = 'children___children',
  children___children___id = 'children___children___id',
  children___children___parent___id = 'children___children___parent___id',
  children___children___parent___children = 'children___children___parent___children',
  children___children___children = 'children___children___children',
  children___children___children___id = 'children___children___children___id',
  children___children___children___children = 'children___children___children___children',
  children___children___internal___content = 'children___children___internal___content',
  children___children___internal___contentDigest = 'children___children___internal___contentDigest',
  children___children___internal___description = 'children___children___internal___description',
  children___children___internal___fieldOwners = 'children___children___internal___fieldOwners',
  children___children___internal___ignoreType = 'children___children___internal___ignoreType',
  children___children___internal___mediaType = 'children___children___internal___mediaType',
  children___children___internal___owner = 'children___children___internal___owner',
  children___children___internal___type = 'children___children___internal___type',
  children___internal___content = 'children___internal___content',
  children___internal___contentDigest = 'children___internal___contentDigest',
  children___internal___description = 'children___internal___description',
  children___internal___fieldOwners = 'children___internal___fieldOwners',
  children___internal___ignoreType = 'children___internal___ignoreType',
  children___internal___mediaType = 'children___internal___mediaType',
  children___internal___owner = 'children___internal___owner',
  children___internal___type = 'children___internal___type',
  internal___content = 'internal___content',
  internal___contentDigest = 'internal___contentDigest',
  internal___description = 'internal___description',
  internal___fieldOwners = 'internal___fieldOwners',
  internal___ignoreType = 'internal___ignoreType',
  internal___mediaType = 'internal___mediaType',
  internal___owner = 'internal___owner',
  internal___type = 'internal___type'
}

export type ImageSharpFilterInput = {
  readonly fixed?: Maybe<ImageSharpFixedFilterInput>,
  readonly resolutions?: Maybe<ImageSharpResolutionsFilterInput>,
  readonly fluid?: Maybe<ImageSharpFluidFilterInput>,
  readonly sizes?: Maybe<ImageSharpSizesFilterInput>,
  readonly original?: Maybe<ImageSharpOriginalFilterInput>,
  readonly resize?: Maybe<ImageSharpResizeFilterInput>,
  readonly id?: Maybe<StringQueryOperatorInput>,
  readonly parent?: Maybe<NodeFilterInput>,
  readonly children?: Maybe<NodeFilterListInput>,
  readonly internal?: Maybe<InternalFilterInput>,
};

export type ImageSharpFixed = {
  readonly __typename?: 'ImageSharpFixed',
  readonly base64?: Maybe<Scalars['String']>,
  readonly tracedSVG?: Maybe<Scalars['String']>,
  readonly aspectRatio?: Maybe<Scalars['Float']>,
  readonly width: Scalars['Float'],
  readonly height: Scalars['Float'],
  readonly src: Scalars['String'],
  readonly srcSet: Scalars['String'],
  readonly srcWebp?: Maybe<Scalars['String']>,
  readonly srcSetWebp?: Maybe<Scalars['String']>,
  readonly originalName?: Maybe<Scalars['String']>,
};

export type ImageSharpFixedFilterInput = {
  readonly base64?: Maybe<StringQueryOperatorInput>,
  readonly tracedSVG?: Maybe<StringQueryOperatorInput>,
  readonly aspectRatio?: Maybe<FloatQueryOperatorInput>,
  readonly width?: Maybe<FloatQueryOperatorInput>,
  readonly height?: Maybe<FloatQueryOperatorInput>,
  readonly src?: Maybe<StringQueryOperatorInput>,
  readonly srcSet?: Maybe<StringQueryOperatorInput>,
  readonly srcWebp?: Maybe<StringQueryOperatorInput>,
  readonly srcSetWebp?: Maybe<StringQueryOperatorInput>,
  readonly originalName?: Maybe<StringQueryOperatorInput>,
};

export type ImageSharpFluid = {
  readonly __typename?: 'ImageSharpFluid',
  readonly base64?: Maybe<Scalars['String']>,
  readonly tracedSVG?: Maybe<Scalars['String']>,
  readonly aspectRatio: Scalars['Float'],
  readonly src: Scalars['String'],
  readonly srcSet: Scalars['String'],
  readonly srcWebp?: Maybe<Scalars['String']>,
  readonly srcSetWebp?: Maybe<Scalars['String']>,
  readonly sizes: Scalars['String'],
  readonly originalImg?: Maybe<Scalars['String']>,
  readonly originalName?: Maybe<Scalars['String']>,
  readonly presentationWidth?: Maybe<Scalars['Int']>,
  readonly presentationHeight?: Maybe<Scalars['Int']>,
};

export type ImageSharpFluidFilterInput = {
  readonly base64?: Maybe<StringQueryOperatorInput>,
  readonly tracedSVG?: Maybe<StringQueryOperatorInput>,
  readonly aspectRatio?: Maybe<FloatQueryOperatorInput>,
  readonly src?: Maybe<StringQueryOperatorInput>,
  readonly srcSet?: Maybe<StringQueryOperatorInput>,
  readonly srcWebp?: Maybe<StringQueryOperatorInput>,
  readonly srcSetWebp?: Maybe<StringQueryOperatorInput>,
  readonly sizes?: Maybe<StringQueryOperatorInput>,
  readonly originalImg?: Maybe<StringQueryOperatorInput>,
  readonly originalName?: Maybe<StringQueryOperatorInput>,
  readonly presentationWidth?: Maybe<IntQueryOperatorInput>,
  readonly presentationHeight?: Maybe<IntQueryOperatorInput>,
};

export type ImageSharpGroupConnection = {
  readonly __typename?: 'ImageSharpGroupConnection',
  readonly totalCount: Scalars['Int'],
  readonly edges: ReadonlyArray<ImageSharpEdge>,
  readonly nodes: ReadonlyArray<ImageSharp>,
  readonly pageInfo: PageInfo,
  readonly field: Scalars['String'],
  readonly fieldValue?: Maybe<Scalars['String']>,
};

export type ImageSharpOriginal = {
  readonly __typename?: 'ImageSharpOriginal',
  readonly width?: Maybe<Scalars['Float']>,
  readonly height?: Maybe<Scalars['Float']>,
  readonly src?: Maybe<Scalars['String']>,
};

export type ImageSharpOriginalFilterInput = {
  readonly width?: Maybe<FloatQueryOperatorInput>,
  readonly height?: Maybe<FloatQueryOperatorInput>,
  readonly src?: Maybe<StringQueryOperatorInput>,
};

export type ImageSharpResize = {
  readonly __typename?: 'ImageSharpResize',
  readonly src?: Maybe<Scalars['String']>,
  readonly tracedSVG?: Maybe<Scalars['String']>,
  readonly width?: Maybe<Scalars['Int']>,
  readonly height?: Maybe<Scalars['Int']>,
  readonly aspectRatio?: Maybe<Scalars['Float']>,
  readonly originalName?: Maybe<Scalars['String']>,
};

export type ImageSharpResizeFilterInput = {
  readonly src?: Maybe<StringQueryOperatorInput>,
  readonly tracedSVG?: Maybe<StringQueryOperatorInput>,
  readonly width?: Maybe<IntQueryOperatorInput>,
  readonly height?: Maybe<IntQueryOperatorInput>,
  readonly aspectRatio?: Maybe<FloatQueryOperatorInput>,
  readonly originalName?: Maybe<StringQueryOperatorInput>,
};

export type ImageSharpResolutions = {
  readonly __typename?: 'ImageSharpResolutions',
  readonly base64?: Maybe<Scalars['String']>,
  readonly tracedSVG?: Maybe<Scalars['String']>,
  readonly aspectRatio?: Maybe<Scalars['Float']>,
  readonly width: Scalars['Float'],
  readonly height: Scalars['Float'],
  readonly src: Scalars['String'],
  readonly srcSet: Scalars['String'],
  readonly srcWebp?: Maybe<Scalars['String']>,
  readonly srcSetWebp?: Maybe<Scalars['String']>,
  readonly originalName?: Maybe<Scalars['String']>,
};

export type ImageSharpResolutionsFilterInput = {
  readonly base64?: Maybe<StringQueryOperatorInput>,
  readonly tracedSVG?: Maybe<StringQueryOperatorInput>,
  readonly aspectRatio?: Maybe<FloatQueryOperatorInput>,
  readonly width?: Maybe<FloatQueryOperatorInput>,
  readonly height?: Maybe<FloatQueryOperatorInput>,
  readonly src?: Maybe<StringQueryOperatorInput>,
  readonly srcSet?: Maybe<StringQueryOperatorInput>,
  readonly srcWebp?: Maybe<StringQueryOperatorInput>,
  readonly srcSetWebp?: Maybe<StringQueryOperatorInput>,
  readonly originalName?: Maybe<StringQueryOperatorInput>,
};

export type ImageSharpSizes = {
  readonly __typename?: 'ImageSharpSizes',
  readonly base64?: Maybe<Scalars['String']>,
  readonly tracedSVG?: Maybe<Scalars['String']>,
  readonly aspectRatio: Scalars['Float'],
  readonly src: Scalars['String'],
  readonly srcSet: Scalars['String'],
  readonly srcWebp?: Maybe<Scalars['String']>,
  readonly srcSetWebp?: Maybe<Scalars['String']>,
  readonly sizes: Scalars['String'],
  readonly originalImg?: Maybe<Scalars['String']>,
  readonly originalName?: Maybe<Scalars['String']>,
  readonly presentationWidth?: Maybe<Scalars['Int']>,
  readonly presentationHeight?: Maybe<Scalars['Int']>,
};

export type ImageSharpSizesFilterInput = {
  readonly base64?: Maybe<StringQueryOperatorInput>,
  readonly tracedSVG?: Maybe<StringQueryOperatorInput>,
  readonly aspectRatio?: Maybe<FloatQueryOperatorInput>,
  readonly src?: Maybe<StringQueryOperatorInput>,
  readonly srcSet?: Maybe<StringQueryOperatorInput>,
  readonly srcWebp?: Maybe<StringQueryOperatorInput>,
  readonly srcSetWebp?: Maybe<StringQueryOperatorInput>,
  readonly sizes?: Maybe<StringQueryOperatorInput>,
  readonly originalImg?: Maybe<StringQueryOperatorInput>,
  readonly originalName?: Maybe<StringQueryOperatorInput>,
  readonly presentationWidth?: Maybe<IntQueryOperatorInput>,
  readonly presentationHeight?: Maybe<IntQueryOperatorInput>,
};

export type ImageSharpSortInput = {
  readonly fields?: Maybe<ReadonlyArray<Maybe<ImageSharpFieldsEnum>>>,
  readonly order?: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>,
};

export type Internal = {
  readonly __typename?: 'Internal',
  readonly content?: Maybe<Scalars['String']>,
  readonly contentDigest: Scalars['String'],
  readonly description?: Maybe<Scalars['String']>,
  readonly fieldOwners?: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>,
  readonly ignoreType?: Maybe<Scalars['Boolean']>,
  readonly mediaType?: Maybe<Scalars['String']>,
  readonly owner: Scalars['String'],
  readonly type: Scalars['String'],
};

export type InternalFilterInput = {
  readonly content?: Maybe<StringQueryOperatorInput>,
  readonly contentDigest?: Maybe<StringQueryOperatorInput>,
  readonly description?: Maybe<StringQueryOperatorInput>,
  readonly fieldOwners?: Maybe<StringQueryOperatorInput>,
  readonly ignoreType?: Maybe<BooleanQueryOperatorInput>,
  readonly mediaType?: Maybe<StringQueryOperatorInput>,
  readonly owner?: Maybe<StringQueryOperatorInput>,
  readonly type?: Maybe<StringQueryOperatorInput>,
};

export type IntQueryOperatorInput = {
  readonly eq?: Maybe<Scalars['Int']>,
  readonly ne?: Maybe<Scalars['Int']>,
  readonly gt?: Maybe<Scalars['Int']>,
  readonly gte?: Maybe<Scalars['Int']>,
  readonly lt?: Maybe<Scalars['Int']>,
  readonly lte?: Maybe<Scalars['Int']>,
  readonly in?: Maybe<ReadonlyArray<Maybe<Scalars['Int']>>>,
  readonly nin?: Maybe<ReadonlyArray<Maybe<Scalars['Int']>>>,
};


export type JSONQueryOperatorInput = {
  readonly eq?: Maybe<Scalars['JSON']>,
  readonly ne?: Maybe<Scalars['JSON']>,
  readonly in?: Maybe<ReadonlyArray<Maybe<Scalars['JSON']>>>,
  readonly nin?: Maybe<ReadonlyArray<Maybe<Scalars['JSON']>>>,
  readonly regex?: Maybe<Scalars['JSON']>,
  readonly glob?: Maybe<Scalars['JSON']>,
};

export type Mdx = Node & {
  readonly __typename?: 'Mdx',
  readonly rawBody: Scalars['String'],
  readonly fileAbsolutePath: Scalars['String'],
  readonly frontmatter?: Maybe<MdxFrontmatter>,
  readonly body: Scalars['String'],
  readonly excerpt: Scalars['String'],
  readonly headings?: Maybe<ReadonlyArray<Maybe<MdxHeadingMdx>>>,
  readonly html?: Maybe<Scalars['String']>,
  readonly mdxAST?: Maybe<Scalars['JSON']>,
  readonly tableOfContents?: Maybe<Scalars['JSON']>,
  readonly timeToRead?: Maybe<Scalars['Int']>,
  readonly wordCount?: Maybe<MdxWordCount>,
  readonly fields?: Maybe<MdxFields>,
  readonly id: Scalars['ID'],
  readonly parent?: Maybe<Node>,
  readonly children: ReadonlyArray<Node>,
  readonly internal: Internal,
};


export type MdxexcerptArgs = {
  pruneLength?: Maybe<Scalars['Int']>
};


export type MdxheadingsArgs = {
  depth?: Maybe<HeadingsMdx>
};


export type MdxtableOfContentsArgs = {
  maxDepth?: Maybe<Scalars['Int']>
};

export type MdxConnection = {
  readonly __typename?: 'MdxConnection',
  readonly totalCount: Scalars['Int'],
  readonly edges: ReadonlyArray<MdxEdge>,
  readonly nodes: ReadonlyArray<Mdx>,
  readonly pageInfo: PageInfo,
  readonly distinct: ReadonlyArray<Scalars['String']>,
  readonly group: ReadonlyArray<MdxGroupConnection>,
};


export type MdxConnectiondistinctArgs = {
  field: MdxFieldsEnum
};


export type MdxConnectiongroupArgs = {
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  field: MdxFieldsEnum
};

export type MdxEdge = {
  readonly __typename?: 'MdxEdge',
  readonly next?: Maybe<Mdx>,
  readonly node: Mdx,
  readonly previous?: Maybe<Mdx>,
};

export type MdxFields = {
  readonly __typename?: 'MdxFields',
  readonly route: Scalars['String'],
  readonly isHidden: Scalars['Boolean'],
  readonly history?: Maybe<BlogpostHistory>,
  readonly readingTime: Scalars['Int'],
  readonly socialImage?: Maybe<File>,
};

export enum MdxFieldsEnum {
  rawBody = 'rawBody',
  fileAbsolutePath = 'fileAbsolutePath',
  frontmatter___title = 'frontmatter___title',
  frontmatter___spoiler = 'frontmatter___spoiler',
  frontmatter___date = 'frontmatter___date',
  frontmatter___history = 'frontmatter___history',
  frontmatter___historySource = 'frontmatter___historySource',
  frontmatter___venues = 'frontmatter___venues',
  frontmatter___venues___name = 'frontmatter___venues___name',
  frontmatter___venues___link = 'frontmatter___venues___link',
  body = 'body',
  excerpt = 'excerpt',
  headings = 'headings',
  headings___value = 'headings___value',
  headings___depth = 'headings___depth',
  html = 'html',
  mdxAST = 'mdxAST',
  tableOfContents = 'tableOfContents',
  timeToRead = 'timeToRead',
  wordCount___paragraphs = 'wordCount___paragraphs',
  wordCount___sentences = 'wordCount___sentences',
  wordCount___words = 'wordCount___words',
  fields___route = 'fields___route',
  fields___isHidden = 'fields___isHidden',
  fields___history___entries = 'fields___history___entries',
  fields___history___entries___abbreviatedCommit = 'fields___history___entries___abbreviatedCommit',
  fields___history___entries___authorDate = 'fields___history___entries___authorDate',
  fields___history___entries___subject = 'fields___history___entries___subject',
  fields___history___entries___body = 'fields___history___entries___body',
  fields___history___url = 'fields___history___url',
  fields___readingTime = 'fields___readingTime',
  fields___socialImage___sourceInstanceName = 'fields___socialImage___sourceInstanceName',
  fields___socialImage___absolutePath = 'fields___socialImage___absolutePath',
  fields___socialImage___relativePath = 'fields___socialImage___relativePath',
  fields___socialImage___extension = 'fields___socialImage___extension',
  fields___socialImage___size = 'fields___socialImage___size',
  fields___socialImage___prettySize = 'fields___socialImage___prettySize',
  fields___socialImage___modifiedTime = 'fields___socialImage___modifiedTime',
  fields___socialImage___accessTime = 'fields___socialImage___accessTime',
  fields___socialImage___changeTime = 'fields___socialImage___changeTime',
  fields___socialImage___birthTime = 'fields___socialImage___birthTime',
  fields___socialImage___root = 'fields___socialImage___root',
  fields___socialImage___dir = 'fields___socialImage___dir',
  fields___socialImage___base = 'fields___socialImage___base',
  fields___socialImage___ext = 'fields___socialImage___ext',
  fields___socialImage___name = 'fields___socialImage___name',
  fields___socialImage___relativeDirectory = 'fields___socialImage___relativeDirectory',
  fields___socialImage___dev = 'fields___socialImage___dev',
  fields___socialImage___mode = 'fields___socialImage___mode',
  fields___socialImage___nlink = 'fields___socialImage___nlink',
  fields___socialImage___uid = 'fields___socialImage___uid',
  fields___socialImage___gid = 'fields___socialImage___gid',
  fields___socialImage___rdev = 'fields___socialImage___rdev',
  fields___socialImage___ino = 'fields___socialImage___ino',
  fields___socialImage___atimeMs = 'fields___socialImage___atimeMs',
  fields___socialImage___mtimeMs = 'fields___socialImage___mtimeMs',
  fields___socialImage___ctimeMs = 'fields___socialImage___ctimeMs',
  fields___socialImage___atime = 'fields___socialImage___atime',
  fields___socialImage___mtime = 'fields___socialImage___mtime',
  fields___socialImage___ctime = 'fields___socialImage___ctime',
  fields___socialImage___birthtime = 'fields___socialImage___birthtime',
  fields___socialImage___birthtimeMs = 'fields___socialImage___birthtimeMs',
  fields___socialImage___blksize = 'fields___socialImage___blksize',
  fields___socialImage___blocks = 'fields___socialImage___blocks',
  fields___socialImage___publicURL = 'fields___socialImage___publicURL',
  fields___socialImage___childImageSharp___id = 'fields___socialImage___childImageSharp___id',
  fields___socialImage___childImageSharp___children = 'fields___socialImage___childImageSharp___children',
  fields___socialImage___id = 'fields___socialImage___id',
  fields___socialImage___parent___id = 'fields___socialImage___parent___id',
  fields___socialImage___parent___children = 'fields___socialImage___parent___children',
  fields___socialImage___children = 'fields___socialImage___children',
  fields___socialImage___children___id = 'fields___socialImage___children___id',
  fields___socialImage___children___children = 'fields___socialImage___children___children',
  fields___socialImage___internal___content = 'fields___socialImage___internal___content',
  fields___socialImage___internal___contentDigest = 'fields___socialImage___internal___contentDigest',
  fields___socialImage___internal___description = 'fields___socialImage___internal___description',
  fields___socialImage___internal___fieldOwners = 'fields___socialImage___internal___fieldOwners',
  fields___socialImage___internal___ignoreType = 'fields___socialImage___internal___ignoreType',
  fields___socialImage___internal___mediaType = 'fields___socialImage___internal___mediaType',
  fields___socialImage___internal___owner = 'fields___socialImage___internal___owner',
  fields___socialImage___internal___type = 'fields___socialImage___internal___type',
  fields___socialImage___childMdx___rawBody = 'fields___socialImage___childMdx___rawBody',
  fields___socialImage___childMdx___fileAbsolutePath = 'fields___socialImage___childMdx___fileAbsolutePath',
  fields___socialImage___childMdx___body = 'fields___socialImage___childMdx___body',
  fields___socialImage___childMdx___excerpt = 'fields___socialImage___childMdx___excerpt',
  fields___socialImage___childMdx___headings = 'fields___socialImage___childMdx___headings',
  fields___socialImage___childMdx___html = 'fields___socialImage___childMdx___html',
  fields___socialImage___childMdx___mdxAST = 'fields___socialImage___childMdx___mdxAST',
  fields___socialImage___childMdx___tableOfContents = 'fields___socialImage___childMdx___tableOfContents',
  fields___socialImage___childMdx___timeToRead = 'fields___socialImage___childMdx___timeToRead',
  fields___socialImage___childMdx___id = 'fields___socialImage___childMdx___id',
  fields___socialImage___childMdx___children = 'fields___socialImage___childMdx___children',
  id = 'id',
  parent___id = 'parent___id',
  parent___parent___id = 'parent___parent___id',
  parent___parent___parent___id = 'parent___parent___parent___id',
  parent___parent___parent___children = 'parent___parent___parent___children',
  parent___parent___children = 'parent___parent___children',
  parent___parent___children___id = 'parent___parent___children___id',
  parent___parent___children___children = 'parent___parent___children___children',
  parent___parent___internal___content = 'parent___parent___internal___content',
  parent___parent___internal___contentDigest = 'parent___parent___internal___contentDigest',
  parent___parent___internal___description = 'parent___parent___internal___description',
  parent___parent___internal___fieldOwners = 'parent___parent___internal___fieldOwners',
  parent___parent___internal___ignoreType = 'parent___parent___internal___ignoreType',
  parent___parent___internal___mediaType = 'parent___parent___internal___mediaType',
  parent___parent___internal___owner = 'parent___parent___internal___owner',
  parent___parent___internal___type = 'parent___parent___internal___type',
  parent___children = 'parent___children',
  parent___children___id = 'parent___children___id',
  parent___children___parent___id = 'parent___children___parent___id',
  parent___children___parent___children = 'parent___children___parent___children',
  parent___children___children = 'parent___children___children',
  parent___children___children___id = 'parent___children___children___id',
  parent___children___children___children = 'parent___children___children___children',
  parent___children___internal___content = 'parent___children___internal___content',
  parent___children___internal___contentDigest = 'parent___children___internal___contentDigest',
  parent___children___internal___description = 'parent___children___internal___description',
  parent___children___internal___fieldOwners = 'parent___children___internal___fieldOwners',
  parent___children___internal___ignoreType = 'parent___children___internal___ignoreType',
  parent___children___internal___mediaType = 'parent___children___internal___mediaType',
  parent___children___internal___owner = 'parent___children___internal___owner',
  parent___children___internal___type = 'parent___children___internal___type',
  parent___internal___content = 'parent___internal___content',
  parent___internal___contentDigest = 'parent___internal___contentDigest',
  parent___internal___description = 'parent___internal___description',
  parent___internal___fieldOwners = 'parent___internal___fieldOwners',
  parent___internal___ignoreType = 'parent___internal___ignoreType',
  parent___internal___mediaType = 'parent___internal___mediaType',
  parent___internal___owner = 'parent___internal___owner',
  parent___internal___type = 'parent___internal___type',
  children = 'children',
  children___id = 'children___id',
  children___parent___id = 'children___parent___id',
  children___parent___parent___id = 'children___parent___parent___id',
  children___parent___parent___children = 'children___parent___parent___children',
  children___parent___children = 'children___parent___children',
  children___parent___children___id = 'children___parent___children___id',
  children___parent___children___children = 'children___parent___children___children',
  children___parent___internal___content = 'children___parent___internal___content',
  children___parent___internal___contentDigest = 'children___parent___internal___contentDigest',
  children___parent___internal___description = 'children___parent___internal___description',
  children___parent___internal___fieldOwners = 'children___parent___internal___fieldOwners',
  children___parent___internal___ignoreType = 'children___parent___internal___ignoreType',
  children___parent___internal___mediaType = 'children___parent___internal___mediaType',
  children___parent___internal___owner = 'children___parent___internal___owner',
  children___parent___internal___type = 'children___parent___internal___type',
  children___children = 'children___children',
  children___children___id = 'children___children___id',
  children___children___parent___id = 'children___children___parent___id',
  children___children___parent___children = 'children___children___parent___children',
  children___children___children = 'children___children___children',
  children___children___children___id = 'children___children___children___id',
  children___children___children___children = 'children___children___children___children',
  children___children___internal___content = 'children___children___internal___content',
  children___children___internal___contentDigest = 'children___children___internal___contentDigest',
  children___children___internal___description = 'children___children___internal___description',
  children___children___internal___fieldOwners = 'children___children___internal___fieldOwners',
  children___children___internal___ignoreType = 'children___children___internal___ignoreType',
  children___children___internal___mediaType = 'children___children___internal___mediaType',
  children___children___internal___owner = 'children___children___internal___owner',
  children___children___internal___type = 'children___children___internal___type',
  children___internal___content = 'children___internal___content',
  children___internal___contentDigest = 'children___internal___contentDigest',
  children___internal___description = 'children___internal___description',
  children___internal___fieldOwners = 'children___internal___fieldOwners',
  children___internal___ignoreType = 'children___internal___ignoreType',
  children___internal___mediaType = 'children___internal___mediaType',
  children___internal___owner = 'children___internal___owner',
  children___internal___type = 'children___internal___type',
  internal___content = 'internal___content',
  internal___contentDigest = 'internal___contentDigest',
  internal___description = 'internal___description',
  internal___fieldOwners = 'internal___fieldOwners',
  internal___ignoreType = 'internal___ignoreType',
  internal___mediaType = 'internal___mediaType',
  internal___owner = 'internal___owner',
  internal___type = 'internal___type'
}

export type MdxFieldsFilterInput = {
  readonly route?: Maybe<StringQueryOperatorInput>,
  readonly isHidden?: Maybe<BooleanQueryOperatorInput>,
  readonly history?: Maybe<BlogpostHistoryFilterInput>,
  readonly readingTime?: Maybe<IntQueryOperatorInput>,
  readonly socialImage?: Maybe<FileFilterInput>,
};

export type MdxFilterInput = {
  readonly rawBody?: Maybe<StringQueryOperatorInput>,
  readonly fileAbsolutePath?: Maybe<StringQueryOperatorInput>,
  readonly frontmatter?: Maybe<MdxFrontmatterFilterInput>,
  readonly body?: Maybe<StringQueryOperatorInput>,
  readonly excerpt?: Maybe<StringQueryOperatorInput>,
  readonly headings?: Maybe<MdxHeadingMdxFilterListInput>,
  readonly html?: Maybe<StringQueryOperatorInput>,
  readonly mdxAST?: Maybe<JSONQueryOperatorInput>,
  readonly tableOfContents?: Maybe<JSONQueryOperatorInput>,
  readonly timeToRead?: Maybe<IntQueryOperatorInput>,
  readonly wordCount?: Maybe<MdxWordCountFilterInput>,
  readonly fields?: Maybe<MdxFieldsFilterInput>,
  readonly id?: Maybe<StringQueryOperatorInput>,
  readonly parent?: Maybe<NodeFilterInput>,
  readonly children?: Maybe<NodeFilterListInput>,
  readonly internal?: Maybe<InternalFilterInput>,
};

export type MdxFrontmatter = {
  readonly __typename?: 'MdxFrontmatter',
  readonly title: Scalars['String'],
  readonly spoiler: Scalars['String'],
  readonly date: Scalars['Date'],
  readonly history?: Maybe<BlogpostHistoryType>,
  readonly historySource?: Maybe<Scalars['String']>,
  readonly venues?: Maybe<ReadonlyArray<Venue>>,
};


export type MdxFrontmatterdateArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};

export type MdxFrontmatterFilterInput = {
  readonly title?: Maybe<StringQueryOperatorInput>,
  readonly spoiler?: Maybe<StringQueryOperatorInput>,
  readonly date?: Maybe<DateQueryOperatorInput>,
  readonly history?: Maybe<BlogpostHistoryTypeQueryOperatorInput>,
  readonly historySource?: Maybe<StringQueryOperatorInput>,
  readonly venues?: Maybe<VenueFilterListInput>,
};

export type MdxGroupConnection = {
  readonly __typename?: 'MdxGroupConnection',
  readonly totalCount: Scalars['Int'],
  readonly edges: ReadonlyArray<MdxEdge>,
  readonly nodes: ReadonlyArray<Mdx>,
  readonly pageInfo: PageInfo,
  readonly field: Scalars['String'],
  readonly fieldValue?: Maybe<Scalars['String']>,
};

export type MdxHeadingMdx = {
  readonly __typename?: 'MdxHeadingMdx',
  readonly value?: Maybe<Scalars['String']>,
  readonly depth?: Maybe<Scalars['Int']>,
};

export type MdxHeadingMdxFilterInput = {
  readonly value?: Maybe<StringQueryOperatorInput>,
  readonly depth?: Maybe<IntQueryOperatorInput>,
};

export type MdxHeadingMdxFilterListInput = {
  readonly elemMatch?: Maybe<MdxHeadingMdxFilterInput>,
};

export type MdxSortInput = {
  readonly fields?: Maybe<ReadonlyArray<Maybe<MdxFieldsEnum>>>,
  readonly order?: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>,
};

export type MdxWordCount = {
  readonly __typename?: 'MdxWordCount',
  readonly paragraphs?: Maybe<Scalars['Int']>,
  readonly sentences?: Maybe<Scalars['Int']>,
  readonly words?: Maybe<Scalars['Int']>,
};

export type MdxWordCountFilterInput = {
  readonly paragraphs?: Maybe<IntQueryOperatorInput>,
  readonly sentences?: Maybe<IntQueryOperatorInput>,
  readonly words?: Maybe<IntQueryOperatorInput>,
};

/** Node Interface */
export type Node = {
  readonly id: Scalars['ID'],
  readonly parent?: Maybe<Node>,
  readonly children: ReadonlyArray<Node>,
  readonly internal: Internal,
};

export type NodeFilterInput = {
  readonly id?: Maybe<StringQueryOperatorInput>,
  readonly parent?: Maybe<NodeFilterInput>,
  readonly children?: Maybe<NodeFilterListInput>,
  readonly internal?: Maybe<InternalFilterInput>,
};

export type NodeFilterListInput = {
  readonly elemMatch?: Maybe<NodeFilterInput>,
};

export type PageInfo = {
  readonly __typename?: 'PageInfo',
  readonly currentPage: Scalars['Int'],
  readonly hasPreviousPage: Scalars['Boolean'],
  readonly hasNextPage: Scalars['Boolean'],
  readonly itemCount: Scalars['Int'],
  readonly pageCount: Scalars['Int'],
  readonly perPage?: Maybe<Scalars['Int']>,
};

export type Potrace = {
  readonly turnPolicy?: Maybe<PotraceTurnPolicy>,
  readonly turdSize?: Maybe<Scalars['Float']>,
  readonly alphaMax?: Maybe<Scalars['Float']>,
  readonly optCurve?: Maybe<Scalars['Boolean']>,
  readonly optTolerance?: Maybe<Scalars['Float']>,
  readonly threshold?: Maybe<Scalars['Int']>,
  readonly blackOnWhite?: Maybe<Scalars['Boolean']>,
  readonly color?: Maybe<Scalars['String']>,
  readonly background?: Maybe<Scalars['String']>,
};

export enum PotraceTurnPolicy {
  TURNPOLICY_BLACK = 'TURNPOLICY_BLACK',
  TURNPOLICY_WHITE = 'TURNPOLICY_WHITE',
  TURNPOLICY_LEFT = 'TURNPOLICY_LEFT',
  TURNPOLICY_RIGHT = 'TURNPOLICY_RIGHT',
  TURNPOLICY_MINORITY = 'TURNPOLICY_MINORITY',
  TURNPOLICY_MAJORITY = 'TURNPOLICY_MAJORITY'
}

export type Query = {
  readonly __typename?: 'Query',
  readonly file?: Maybe<File>,
  readonly allFile: FileConnection,
  readonly directory?: Maybe<Directory>,
  readonly allDirectory: DirectoryConnection,
  readonly imageSharp?: Maybe<ImageSharp>,
  readonly allImageSharp: ImageSharpConnection,
  readonly mdx?: Maybe<Mdx>,
  readonly allMdx: MdxConnection,
  readonly site?: Maybe<Site>,
  readonly allSite: SiteConnection,
  readonly sitePlugin?: Maybe<SitePlugin>,
  readonly allSitePlugin: SitePluginConnection,
  readonly sitePage?: Maybe<SitePage>,
  readonly allSitePage: SitePageConnection,
};


export type QueryfileArgs = {
  sourceInstanceName?: Maybe<StringQueryOperatorInput>,
  absolutePath?: Maybe<StringQueryOperatorInput>,
  relativePath?: Maybe<StringQueryOperatorInput>,
  extension?: Maybe<StringQueryOperatorInput>,
  size?: Maybe<IntQueryOperatorInput>,
  prettySize?: Maybe<StringQueryOperatorInput>,
  modifiedTime?: Maybe<DateQueryOperatorInput>,
  accessTime?: Maybe<DateQueryOperatorInput>,
  changeTime?: Maybe<DateQueryOperatorInput>,
  birthTime?: Maybe<DateQueryOperatorInput>,
  root?: Maybe<StringQueryOperatorInput>,
  dir?: Maybe<StringQueryOperatorInput>,
  base?: Maybe<StringQueryOperatorInput>,
  ext?: Maybe<StringQueryOperatorInput>,
  name?: Maybe<StringQueryOperatorInput>,
  relativeDirectory?: Maybe<StringQueryOperatorInput>,
  dev?: Maybe<IntQueryOperatorInput>,
  mode?: Maybe<IntQueryOperatorInput>,
  nlink?: Maybe<IntQueryOperatorInput>,
  uid?: Maybe<IntQueryOperatorInput>,
  gid?: Maybe<IntQueryOperatorInput>,
  rdev?: Maybe<IntQueryOperatorInput>,
  ino?: Maybe<FloatQueryOperatorInput>,
  atimeMs?: Maybe<FloatQueryOperatorInput>,
  mtimeMs?: Maybe<FloatQueryOperatorInput>,
  ctimeMs?: Maybe<FloatQueryOperatorInput>,
  atime?: Maybe<DateQueryOperatorInput>,
  mtime?: Maybe<DateQueryOperatorInput>,
  ctime?: Maybe<DateQueryOperatorInput>,
  birthtime?: Maybe<DateQueryOperatorInput>,
  birthtimeMs?: Maybe<FloatQueryOperatorInput>,
  blksize?: Maybe<IntQueryOperatorInput>,
  blocks?: Maybe<IntQueryOperatorInput>,
  publicURL?: Maybe<StringQueryOperatorInput>,
  childImageSharp?: Maybe<ImageSharpFilterInput>,
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
  childMdx?: Maybe<MdxFilterInput>
};


export type QueryallFileArgs = {
  filter?: Maybe<FileFilterInput>,
  sort?: Maybe<FileSortInput>,
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>
};


export type QuerydirectoryArgs = {
  sourceInstanceName?: Maybe<StringQueryOperatorInput>,
  absolutePath?: Maybe<StringQueryOperatorInput>,
  relativePath?: Maybe<StringQueryOperatorInput>,
  extension?: Maybe<StringQueryOperatorInput>,
  size?: Maybe<IntQueryOperatorInput>,
  prettySize?: Maybe<StringQueryOperatorInput>,
  modifiedTime?: Maybe<DateQueryOperatorInput>,
  accessTime?: Maybe<DateQueryOperatorInput>,
  changeTime?: Maybe<DateQueryOperatorInput>,
  birthTime?: Maybe<DateQueryOperatorInput>,
  root?: Maybe<StringQueryOperatorInput>,
  dir?: Maybe<StringQueryOperatorInput>,
  base?: Maybe<StringQueryOperatorInput>,
  ext?: Maybe<StringQueryOperatorInput>,
  name?: Maybe<StringQueryOperatorInput>,
  relativeDirectory?: Maybe<StringQueryOperatorInput>,
  dev?: Maybe<IntQueryOperatorInput>,
  mode?: Maybe<IntQueryOperatorInput>,
  nlink?: Maybe<IntQueryOperatorInput>,
  uid?: Maybe<IntQueryOperatorInput>,
  gid?: Maybe<IntQueryOperatorInput>,
  rdev?: Maybe<IntQueryOperatorInput>,
  ino?: Maybe<FloatQueryOperatorInput>,
  atimeMs?: Maybe<FloatQueryOperatorInput>,
  mtimeMs?: Maybe<FloatQueryOperatorInput>,
  ctimeMs?: Maybe<FloatQueryOperatorInput>,
  atime?: Maybe<DateQueryOperatorInput>,
  mtime?: Maybe<DateQueryOperatorInput>,
  ctime?: Maybe<DateQueryOperatorInput>,
  birthtime?: Maybe<DateQueryOperatorInput>,
  birthtimeMs?: Maybe<FloatQueryOperatorInput>,
  blksize?: Maybe<IntQueryOperatorInput>,
  blocks?: Maybe<IntQueryOperatorInput>,
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>
};


export type QueryallDirectoryArgs = {
  filter?: Maybe<DirectoryFilterInput>,
  sort?: Maybe<DirectorySortInput>,
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>
};


export type QueryimageSharpArgs = {
  fixed?: Maybe<ImageSharpFixedFilterInput>,
  resolutions?: Maybe<ImageSharpResolutionsFilterInput>,
  fluid?: Maybe<ImageSharpFluidFilterInput>,
  sizes?: Maybe<ImageSharpSizesFilterInput>,
  original?: Maybe<ImageSharpOriginalFilterInput>,
  resize?: Maybe<ImageSharpResizeFilterInput>,
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>
};


export type QueryallImageSharpArgs = {
  filter?: Maybe<ImageSharpFilterInput>,
  sort?: Maybe<ImageSharpSortInput>,
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>
};


export type QuerymdxArgs = {
  rawBody?: Maybe<StringQueryOperatorInput>,
  fileAbsolutePath?: Maybe<StringQueryOperatorInput>,
  frontmatter?: Maybe<MdxFrontmatterFilterInput>,
  body?: Maybe<StringQueryOperatorInput>,
  excerpt?: Maybe<StringQueryOperatorInput>,
  headings?: Maybe<MdxHeadingMdxFilterListInput>,
  html?: Maybe<StringQueryOperatorInput>,
  mdxAST?: Maybe<JSONQueryOperatorInput>,
  tableOfContents?: Maybe<JSONQueryOperatorInput>,
  timeToRead?: Maybe<IntQueryOperatorInput>,
  wordCount?: Maybe<MdxWordCountFilterInput>,
  fields?: Maybe<MdxFieldsFilterInput>,
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>
};


export type QueryallMdxArgs = {
  filter?: Maybe<MdxFilterInput>,
  sort?: Maybe<MdxSortInput>,
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>
};


export type QuerysiteArgs = {
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
  siteMetadata?: Maybe<SiteSiteMetadataFilterInput>,
  port?: Maybe<IntQueryOperatorInput>,
  host?: Maybe<StringQueryOperatorInput>,
  polyfill?: Maybe<BooleanQueryOperatorInput>,
  pathPrefix?: Maybe<StringQueryOperatorInput>,
  buildTime?: Maybe<DateQueryOperatorInput>
};


export type QueryallSiteArgs = {
  filter?: Maybe<SiteFilterInput>,
  sort?: Maybe<SiteSortInput>,
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>
};


export type QuerysitePluginArgs = {
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
  resolve?: Maybe<StringQueryOperatorInput>,
  name?: Maybe<StringQueryOperatorInput>,
  version?: Maybe<StringQueryOperatorInput>,
  pluginOptions?: Maybe<SitePluginPluginOptionsFilterInput>,
  nodeAPIs?: Maybe<StringQueryOperatorInput>,
  browserAPIs?: Maybe<StringQueryOperatorInput>,
  ssrAPIs?: Maybe<StringQueryOperatorInput>,
  pluginFilepath?: Maybe<StringQueryOperatorInput>,
  packageJson?: Maybe<SitePluginPackageJsonFilterInput>
};


export type QueryallSitePluginArgs = {
  filter?: Maybe<SitePluginFilterInput>,
  sort?: Maybe<SitePluginSortInput>,
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>
};


export type QuerysitePageArgs = {
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
  path?: Maybe<StringQueryOperatorInput>,
  internalComponentName?: Maybe<StringQueryOperatorInput>,
  component?: Maybe<StringQueryOperatorInput>,
  componentChunkName?: Maybe<StringQueryOperatorInput>,
  isCreatedByStatefulCreatePages?: Maybe<BooleanQueryOperatorInput>,
  context?: Maybe<SitePageContextFilterInput>,
  pluginCreator?: Maybe<SitePluginFilterInput>,
  pluginCreatorId?: Maybe<StringQueryOperatorInput>,
  componentPath?: Maybe<StringQueryOperatorInput>
};


export type QueryallSitePageArgs = {
  filter?: Maybe<SitePageFilterInput>,
  sort?: Maybe<SitePageSortInput>,
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>
};

export type Site = Node & {
  readonly __typename?: 'Site',
  readonly id: Scalars['ID'],
  readonly parent?: Maybe<Node>,
  readonly children: ReadonlyArray<Node>,
  readonly internal: Internal,
  readonly siteMetadata?: Maybe<SiteSiteMetadata>,
  readonly port?: Maybe<Scalars['Int']>,
  readonly host?: Maybe<Scalars['String']>,
  readonly polyfill?: Maybe<Scalars['Boolean']>,
  readonly pathPrefix?: Maybe<Scalars['String']>,
  readonly buildTime?: Maybe<Scalars['Date']>,
};


export type SitebuildTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};

export type SiteConnection = {
  readonly __typename?: 'SiteConnection',
  readonly totalCount: Scalars['Int'],
  readonly edges: ReadonlyArray<SiteEdge>,
  readonly nodes: ReadonlyArray<Site>,
  readonly pageInfo: PageInfo,
  readonly distinct: ReadonlyArray<Scalars['String']>,
  readonly group: ReadonlyArray<SiteGroupConnection>,
};


export type SiteConnectiondistinctArgs = {
  field: SiteFieldsEnum
};


export type SiteConnectiongroupArgs = {
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  field: SiteFieldsEnum
};

export type SiteEdge = {
  readonly __typename?: 'SiteEdge',
  readonly next?: Maybe<Site>,
  readonly node: Site,
  readonly previous?: Maybe<Site>,
};

export enum SiteFieldsEnum {
  id = 'id',
  parent___id = 'parent___id',
  parent___parent___id = 'parent___parent___id',
  parent___parent___parent___id = 'parent___parent___parent___id',
  parent___parent___parent___children = 'parent___parent___parent___children',
  parent___parent___children = 'parent___parent___children',
  parent___parent___children___id = 'parent___parent___children___id',
  parent___parent___children___children = 'parent___parent___children___children',
  parent___parent___internal___content = 'parent___parent___internal___content',
  parent___parent___internal___contentDigest = 'parent___parent___internal___contentDigest',
  parent___parent___internal___description = 'parent___parent___internal___description',
  parent___parent___internal___fieldOwners = 'parent___parent___internal___fieldOwners',
  parent___parent___internal___ignoreType = 'parent___parent___internal___ignoreType',
  parent___parent___internal___mediaType = 'parent___parent___internal___mediaType',
  parent___parent___internal___owner = 'parent___parent___internal___owner',
  parent___parent___internal___type = 'parent___parent___internal___type',
  parent___children = 'parent___children',
  parent___children___id = 'parent___children___id',
  parent___children___parent___id = 'parent___children___parent___id',
  parent___children___parent___children = 'parent___children___parent___children',
  parent___children___children = 'parent___children___children',
  parent___children___children___id = 'parent___children___children___id',
  parent___children___children___children = 'parent___children___children___children',
  parent___children___internal___content = 'parent___children___internal___content',
  parent___children___internal___contentDigest = 'parent___children___internal___contentDigest',
  parent___children___internal___description = 'parent___children___internal___description',
  parent___children___internal___fieldOwners = 'parent___children___internal___fieldOwners',
  parent___children___internal___ignoreType = 'parent___children___internal___ignoreType',
  parent___children___internal___mediaType = 'parent___children___internal___mediaType',
  parent___children___internal___owner = 'parent___children___internal___owner',
  parent___children___internal___type = 'parent___children___internal___type',
  parent___internal___content = 'parent___internal___content',
  parent___internal___contentDigest = 'parent___internal___contentDigest',
  parent___internal___description = 'parent___internal___description',
  parent___internal___fieldOwners = 'parent___internal___fieldOwners',
  parent___internal___ignoreType = 'parent___internal___ignoreType',
  parent___internal___mediaType = 'parent___internal___mediaType',
  parent___internal___owner = 'parent___internal___owner',
  parent___internal___type = 'parent___internal___type',
  children = 'children',
  children___id = 'children___id',
  children___parent___id = 'children___parent___id',
  children___parent___parent___id = 'children___parent___parent___id',
  children___parent___parent___children = 'children___parent___parent___children',
  children___parent___children = 'children___parent___children',
  children___parent___children___id = 'children___parent___children___id',
  children___parent___children___children = 'children___parent___children___children',
  children___parent___internal___content = 'children___parent___internal___content',
  children___parent___internal___contentDigest = 'children___parent___internal___contentDigest',
  children___parent___internal___description = 'children___parent___internal___description',
  children___parent___internal___fieldOwners = 'children___parent___internal___fieldOwners',
  children___parent___internal___ignoreType = 'children___parent___internal___ignoreType',
  children___parent___internal___mediaType = 'children___parent___internal___mediaType',
  children___parent___internal___owner = 'children___parent___internal___owner',
  children___parent___internal___type = 'children___parent___internal___type',
  children___children = 'children___children',
  children___children___id = 'children___children___id',
  children___children___parent___id = 'children___children___parent___id',
  children___children___parent___children = 'children___children___parent___children',
  children___children___children = 'children___children___children',
  children___children___children___id = 'children___children___children___id',
  children___children___children___children = 'children___children___children___children',
  children___children___internal___content = 'children___children___internal___content',
  children___children___internal___contentDigest = 'children___children___internal___contentDigest',
  children___children___internal___description = 'children___children___internal___description',
  children___children___internal___fieldOwners = 'children___children___internal___fieldOwners',
  children___children___internal___ignoreType = 'children___children___internal___ignoreType',
  children___children___internal___mediaType = 'children___children___internal___mediaType',
  children___children___internal___owner = 'children___children___internal___owner',
  children___children___internal___type = 'children___children___internal___type',
  children___internal___content = 'children___internal___content',
  children___internal___contentDigest = 'children___internal___contentDigest',
  children___internal___description = 'children___internal___description',
  children___internal___fieldOwners = 'children___internal___fieldOwners',
  children___internal___ignoreType = 'children___internal___ignoreType',
  children___internal___mediaType = 'children___internal___mediaType',
  children___internal___owner = 'children___internal___owner',
  children___internal___type = 'children___internal___type',
  internal___content = 'internal___content',
  internal___contentDigest = 'internal___contentDigest',
  internal___description = 'internal___description',
  internal___fieldOwners = 'internal___fieldOwners',
  internal___ignoreType = 'internal___ignoreType',
  internal___mediaType = 'internal___mediaType',
  internal___owner = 'internal___owner',
  internal___type = 'internal___type',
  siteMetadata___title = 'siteMetadata___title',
  siteMetadata___titleTemplate = 'siteMetadata___titleTemplate',
  siteMetadata___author = 'siteMetadata___author',
  siteMetadata___description = 'siteMetadata___description',
  siteMetadata___social = 'siteMetadata___social',
  siteMetadata___social___name = 'siteMetadata___social___name',
  siteMetadata___social___url = 'siteMetadata___social___url',
  siteMetadata___siteUrl = 'siteMetadata___siteUrl',
  siteMetadata___htmlAttributes___lang = 'siteMetadata___htmlAttributes___lang',
  siteMetadata___twitterUsername = 'siteMetadata___twitterUsername',
  port = 'port',
  host = 'host',
  polyfill = 'polyfill',
  pathPrefix = 'pathPrefix',
  buildTime = 'buildTime'
}

export type SiteFilterInput = {
  readonly id?: Maybe<StringQueryOperatorInput>,
  readonly parent?: Maybe<NodeFilterInput>,
  readonly children?: Maybe<NodeFilterListInput>,
  readonly internal?: Maybe<InternalFilterInput>,
  readonly siteMetadata?: Maybe<SiteSiteMetadataFilterInput>,
  readonly port?: Maybe<IntQueryOperatorInput>,
  readonly host?: Maybe<StringQueryOperatorInput>,
  readonly polyfill?: Maybe<BooleanQueryOperatorInput>,
  readonly pathPrefix?: Maybe<StringQueryOperatorInput>,
  readonly buildTime?: Maybe<DateQueryOperatorInput>,
};

export type SiteGroupConnection = {
  readonly __typename?: 'SiteGroupConnection',
  readonly totalCount: Scalars['Int'],
  readonly edges: ReadonlyArray<SiteEdge>,
  readonly nodes: ReadonlyArray<Site>,
  readonly pageInfo: PageInfo,
  readonly field: Scalars['String'],
  readonly fieldValue?: Maybe<Scalars['String']>,
};

export type SitePage = Node & {
  readonly __typename?: 'SitePage',
  readonly id: Scalars['ID'],
  readonly parent?: Maybe<Node>,
  readonly children: ReadonlyArray<Node>,
  readonly internal: Internal,
  readonly path?: Maybe<Scalars['String']>,
  readonly internalComponentName?: Maybe<Scalars['String']>,
  readonly component?: Maybe<Scalars['String']>,
  readonly componentChunkName?: Maybe<Scalars['String']>,
  readonly isCreatedByStatefulCreatePages?: Maybe<Scalars['Boolean']>,
  readonly context?: Maybe<SitePageContext>,
  readonly pluginCreator?: Maybe<SitePlugin>,
  readonly pluginCreatorId?: Maybe<Scalars['String']>,
  readonly componentPath?: Maybe<Scalars['String']>,
};

export type SitePageConnection = {
  readonly __typename?: 'SitePageConnection',
  readonly totalCount: Scalars['Int'],
  readonly edges: ReadonlyArray<SitePageEdge>,
  readonly nodes: ReadonlyArray<SitePage>,
  readonly pageInfo: PageInfo,
  readonly distinct: ReadonlyArray<Scalars['String']>,
  readonly group: ReadonlyArray<SitePageGroupConnection>,
};


export type SitePageConnectiondistinctArgs = {
  field: SitePageFieldsEnum
};


export type SitePageConnectiongroupArgs = {
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  field: SitePageFieldsEnum
};

export type SitePageContext = {
  readonly __typename?: 'SitePageContext',
  readonly frontmatter?: Maybe<SitePageContextFrontmatter>,
  readonly route?: Maybe<Scalars['String']>,
  readonly readingTime?: Maybe<Scalars['Int']>,
  readonly history?: Maybe<SitePageContextHistory>,
  readonly socialImage?: Maybe<SitePageContextSocialImage>,
};

export type SitePageContextFilterInput = {
  readonly frontmatter?: Maybe<SitePageContextFrontmatterFilterInput>,
  readonly route?: Maybe<StringQueryOperatorInput>,
  readonly readingTime?: Maybe<IntQueryOperatorInput>,
  readonly history?: Maybe<SitePageContextHistoryFilterInput>,
  readonly socialImage?: Maybe<SitePageContextSocialImageFilterInput>,
};

export type SitePageContextFrontmatter = {
  readonly __typename?: 'SitePageContextFrontmatter',
  readonly title?: Maybe<Scalars['String']>,
  readonly spoiler?: Maybe<Scalars['String']>,
  readonly date?: Maybe<Scalars['Date']>,
  readonly history?: Maybe<Scalars['String']>,
  readonly tags?: Maybe<Scalars['String']>,
  readonly historySource?: Maybe<Scalars['String']>,
  readonly venues?: Maybe<ReadonlyArray<Maybe<SitePageContextFrontmatterVenues>>>,
};

export type SitePageContextFrontmatterFilterInput = {
  readonly title?: Maybe<StringQueryOperatorInput>,
  readonly spoiler?: Maybe<StringQueryOperatorInput>,
  readonly date?: Maybe<DateQueryOperatorInput>,
  readonly history?: Maybe<StringQueryOperatorInput>,
  readonly tags?: Maybe<StringQueryOperatorInput>,
  readonly historySource?: Maybe<StringQueryOperatorInput>,
  readonly venues?: Maybe<SitePageContextFrontmatterVenuesFilterListInput>,
};

export type SitePageContextFrontmatterVenues = {
  readonly __typename?: 'SitePageContextFrontmatterVenues',
  readonly name?: Maybe<Scalars['String']>,
  readonly link?: Maybe<Scalars['String']>,
};

export type SitePageContextFrontmatterVenuesFilterInput = {
  readonly name?: Maybe<StringQueryOperatorInput>,
  readonly link?: Maybe<StringQueryOperatorInput>,
};

export type SitePageContextFrontmatterVenuesFilterListInput = {
  readonly elemMatch?: Maybe<SitePageContextFrontmatterVenuesFilterInput>,
};

export type SitePageContextHistory = {
  readonly __typename?: 'SitePageContextHistory',
  readonly entries?: Maybe<ReadonlyArray<Maybe<SitePageContextHistoryEntries>>>,
  readonly url?: Maybe<Scalars['String']>,
};

export type SitePageContextHistoryEntries = {
  readonly __typename?: 'SitePageContextHistoryEntries',
  readonly subject?: Maybe<Scalars['String']>,
  readonly authorDate?: Maybe<Scalars['String']>,
  readonly abbreviatedCommit?: Maybe<Scalars['String']>,
};

export type SitePageContextHistoryEntriesFilterInput = {
  readonly subject?: Maybe<StringQueryOperatorInput>,
  readonly authorDate?: Maybe<StringQueryOperatorInput>,
  readonly abbreviatedCommit?: Maybe<StringQueryOperatorInput>,
};

export type SitePageContextHistoryEntriesFilterListInput = {
  readonly elemMatch?: Maybe<SitePageContextHistoryEntriesFilterInput>,
};

export type SitePageContextHistoryFilterInput = {
  readonly entries?: Maybe<SitePageContextHistoryEntriesFilterListInput>,
  readonly url?: Maybe<StringQueryOperatorInput>,
};

export type SitePageContextSocialImage = {
  readonly __typename?: 'SitePageContextSocialImage',
  readonly childImageSharp?: Maybe<SitePageContextSocialImageChildImageSharp>,
};

export type SitePageContextSocialImageChildImageSharp = {
  readonly __typename?: 'SitePageContextSocialImageChildImageSharp',
  readonly original?: Maybe<SitePageContextSocialImageChildImageSharpOriginal>,
};

export type SitePageContextSocialImageChildImageSharpFilterInput = {
  readonly original?: Maybe<SitePageContextSocialImageChildImageSharpOriginalFilterInput>,
};

export type SitePageContextSocialImageChildImageSharpOriginal = {
  readonly __typename?: 'SitePageContextSocialImageChildImageSharpOriginal',
  readonly width?: Maybe<Scalars['Int']>,
  readonly height?: Maybe<Scalars['Int']>,
  readonly src?: Maybe<Scalars['String']>,
};

export type SitePageContextSocialImageChildImageSharpOriginalFilterInput = {
  readonly width?: Maybe<IntQueryOperatorInput>,
  readonly height?: Maybe<IntQueryOperatorInput>,
  readonly src?: Maybe<StringQueryOperatorInput>,
};

export type SitePageContextSocialImageFilterInput = {
  readonly childImageSharp?: Maybe<SitePageContextSocialImageChildImageSharpFilterInput>,
};

export type SitePageEdge = {
  readonly __typename?: 'SitePageEdge',
  readonly next?: Maybe<SitePage>,
  readonly node: SitePage,
  readonly previous?: Maybe<SitePage>,
};

export enum SitePageFieldsEnum {
  id = 'id',
  parent___id = 'parent___id',
  parent___parent___id = 'parent___parent___id',
  parent___parent___parent___id = 'parent___parent___parent___id',
  parent___parent___parent___children = 'parent___parent___parent___children',
  parent___parent___children = 'parent___parent___children',
  parent___parent___children___id = 'parent___parent___children___id',
  parent___parent___children___children = 'parent___parent___children___children',
  parent___parent___internal___content = 'parent___parent___internal___content',
  parent___parent___internal___contentDigest = 'parent___parent___internal___contentDigest',
  parent___parent___internal___description = 'parent___parent___internal___description',
  parent___parent___internal___fieldOwners = 'parent___parent___internal___fieldOwners',
  parent___parent___internal___ignoreType = 'parent___parent___internal___ignoreType',
  parent___parent___internal___mediaType = 'parent___parent___internal___mediaType',
  parent___parent___internal___owner = 'parent___parent___internal___owner',
  parent___parent___internal___type = 'parent___parent___internal___type',
  parent___children = 'parent___children',
  parent___children___id = 'parent___children___id',
  parent___children___parent___id = 'parent___children___parent___id',
  parent___children___parent___children = 'parent___children___parent___children',
  parent___children___children = 'parent___children___children',
  parent___children___children___id = 'parent___children___children___id',
  parent___children___children___children = 'parent___children___children___children',
  parent___children___internal___content = 'parent___children___internal___content',
  parent___children___internal___contentDigest = 'parent___children___internal___contentDigest',
  parent___children___internal___description = 'parent___children___internal___description',
  parent___children___internal___fieldOwners = 'parent___children___internal___fieldOwners',
  parent___children___internal___ignoreType = 'parent___children___internal___ignoreType',
  parent___children___internal___mediaType = 'parent___children___internal___mediaType',
  parent___children___internal___owner = 'parent___children___internal___owner',
  parent___children___internal___type = 'parent___children___internal___type',
  parent___internal___content = 'parent___internal___content',
  parent___internal___contentDigest = 'parent___internal___contentDigest',
  parent___internal___description = 'parent___internal___description',
  parent___internal___fieldOwners = 'parent___internal___fieldOwners',
  parent___internal___ignoreType = 'parent___internal___ignoreType',
  parent___internal___mediaType = 'parent___internal___mediaType',
  parent___internal___owner = 'parent___internal___owner',
  parent___internal___type = 'parent___internal___type',
  children = 'children',
  children___id = 'children___id',
  children___parent___id = 'children___parent___id',
  children___parent___parent___id = 'children___parent___parent___id',
  children___parent___parent___children = 'children___parent___parent___children',
  children___parent___children = 'children___parent___children',
  children___parent___children___id = 'children___parent___children___id',
  children___parent___children___children = 'children___parent___children___children',
  children___parent___internal___content = 'children___parent___internal___content',
  children___parent___internal___contentDigest = 'children___parent___internal___contentDigest',
  children___parent___internal___description = 'children___parent___internal___description',
  children___parent___internal___fieldOwners = 'children___parent___internal___fieldOwners',
  children___parent___internal___ignoreType = 'children___parent___internal___ignoreType',
  children___parent___internal___mediaType = 'children___parent___internal___mediaType',
  children___parent___internal___owner = 'children___parent___internal___owner',
  children___parent___internal___type = 'children___parent___internal___type',
  children___children = 'children___children',
  children___children___id = 'children___children___id',
  children___children___parent___id = 'children___children___parent___id',
  children___children___parent___children = 'children___children___parent___children',
  children___children___children = 'children___children___children',
  children___children___children___id = 'children___children___children___id',
  children___children___children___children = 'children___children___children___children',
  children___children___internal___content = 'children___children___internal___content',
  children___children___internal___contentDigest = 'children___children___internal___contentDigest',
  children___children___internal___description = 'children___children___internal___description',
  children___children___internal___fieldOwners = 'children___children___internal___fieldOwners',
  children___children___internal___ignoreType = 'children___children___internal___ignoreType',
  children___children___internal___mediaType = 'children___children___internal___mediaType',
  children___children___internal___owner = 'children___children___internal___owner',
  children___children___internal___type = 'children___children___internal___type',
  children___internal___content = 'children___internal___content',
  children___internal___contentDigest = 'children___internal___contentDigest',
  children___internal___description = 'children___internal___description',
  children___internal___fieldOwners = 'children___internal___fieldOwners',
  children___internal___ignoreType = 'children___internal___ignoreType',
  children___internal___mediaType = 'children___internal___mediaType',
  children___internal___owner = 'children___internal___owner',
  children___internal___type = 'children___internal___type',
  internal___content = 'internal___content',
  internal___contentDigest = 'internal___contentDigest',
  internal___description = 'internal___description',
  internal___fieldOwners = 'internal___fieldOwners',
  internal___ignoreType = 'internal___ignoreType',
  internal___mediaType = 'internal___mediaType',
  internal___owner = 'internal___owner',
  internal___type = 'internal___type',
  path = 'path',
  internalComponentName = 'internalComponentName',
  component = 'component',
  componentChunkName = 'componentChunkName',
  isCreatedByStatefulCreatePages = 'isCreatedByStatefulCreatePages',
  context___frontmatter___title = 'context___frontmatter___title',
  context___frontmatter___spoiler = 'context___frontmatter___spoiler',
  context___frontmatter___date = 'context___frontmatter___date',
  context___frontmatter___history = 'context___frontmatter___history',
  context___frontmatter___tags = 'context___frontmatter___tags',
  context___frontmatter___historySource = 'context___frontmatter___historySource',
  context___frontmatter___venues = 'context___frontmatter___venues',
  context___frontmatter___venues___name = 'context___frontmatter___venues___name',
  context___frontmatter___venues___link = 'context___frontmatter___venues___link',
  context___route = 'context___route',
  context___readingTime = 'context___readingTime',
  context___history___entries = 'context___history___entries',
  context___history___entries___subject = 'context___history___entries___subject',
  context___history___entries___authorDate = 'context___history___entries___authorDate',
  context___history___entries___abbreviatedCommit = 'context___history___entries___abbreviatedCommit',
  context___history___url = 'context___history___url',
  pluginCreator___id = 'pluginCreator___id',
  pluginCreator___parent___id = 'pluginCreator___parent___id',
  pluginCreator___parent___parent___id = 'pluginCreator___parent___parent___id',
  pluginCreator___parent___parent___children = 'pluginCreator___parent___parent___children',
  pluginCreator___parent___children = 'pluginCreator___parent___children',
  pluginCreator___parent___children___id = 'pluginCreator___parent___children___id',
  pluginCreator___parent___children___children = 'pluginCreator___parent___children___children',
  pluginCreator___parent___internal___content = 'pluginCreator___parent___internal___content',
  pluginCreator___parent___internal___contentDigest = 'pluginCreator___parent___internal___contentDigest',
  pluginCreator___parent___internal___description = 'pluginCreator___parent___internal___description',
  pluginCreator___parent___internal___fieldOwners = 'pluginCreator___parent___internal___fieldOwners',
  pluginCreator___parent___internal___ignoreType = 'pluginCreator___parent___internal___ignoreType',
  pluginCreator___parent___internal___mediaType = 'pluginCreator___parent___internal___mediaType',
  pluginCreator___parent___internal___owner = 'pluginCreator___parent___internal___owner',
  pluginCreator___parent___internal___type = 'pluginCreator___parent___internal___type',
  pluginCreator___children = 'pluginCreator___children',
  pluginCreator___children___id = 'pluginCreator___children___id',
  pluginCreator___children___parent___id = 'pluginCreator___children___parent___id',
  pluginCreator___children___parent___children = 'pluginCreator___children___parent___children',
  pluginCreator___children___children = 'pluginCreator___children___children',
  pluginCreator___children___children___id = 'pluginCreator___children___children___id',
  pluginCreator___children___children___children = 'pluginCreator___children___children___children',
  pluginCreator___children___internal___content = 'pluginCreator___children___internal___content',
  pluginCreator___children___internal___contentDigest = 'pluginCreator___children___internal___contentDigest',
  pluginCreator___children___internal___description = 'pluginCreator___children___internal___description',
  pluginCreator___children___internal___fieldOwners = 'pluginCreator___children___internal___fieldOwners',
  pluginCreator___children___internal___ignoreType = 'pluginCreator___children___internal___ignoreType',
  pluginCreator___children___internal___mediaType = 'pluginCreator___children___internal___mediaType',
  pluginCreator___children___internal___owner = 'pluginCreator___children___internal___owner',
  pluginCreator___children___internal___type = 'pluginCreator___children___internal___type',
  pluginCreator___internal___content = 'pluginCreator___internal___content',
  pluginCreator___internal___contentDigest = 'pluginCreator___internal___contentDigest',
  pluginCreator___internal___description = 'pluginCreator___internal___description',
  pluginCreator___internal___fieldOwners = 'pluginCreator___internal___fieldOwners',
  pluginCreator___internal___ignoreType = 'pluginCreator___internal___ignoreType',
  pluginCreator___internal___mediaType = 'pluginCreator___internal___mediaType',
  pluginCreator___internal___owner = 'pluginCreator___internal___owner',
  pluginCreator___internal___type = 'pluginCreator___internal___type',
  pluginCreator___resolve = 'pluginCreator___resolve',
  pluginCreator___name = 'pluginCreator___name',
  pluginCreator___version = 'pluginCreator___version',
  pluginCreator___pluginOptions___extensions = 'pluginCreator___pluginOptions___extensions',
  pluginCreator___pluginOptions___commonmark = 'pluginCreator___pluginOptions___commonmark',
  pluginCreator___pluginOptions___gatsbyRemarkPlugins = 'pluginCreator___pluginOptions___gatsbyRemarkPlugins',
  pluginCreator___pluginOptions___gatsbyRemarkPlugins___resolve = 'pluginCreator___pluginOptions___gatsbyRemarkPlugins___resolve',
  pluginCreator___pluginOptions___defaultLayouts___posts = 'pluginCreator___pluginOptions___defaultLayouts___posts',
  pluginCreator___pluginOptions___path = 'pluginCreator___pluginOptions___path',
  pluginCreator___pluginOptions___name = 'pluginCreator___pluginOptions___name',
  pluginCreator___pluginOptions___allowNamespaces = 'pluginCreator___pluginOptions___allowNamespaces',
  pluginCreator___pluginOptions___localSchemaFile = 'pluginCreator___pluginOptions___localSchemaFile',
  pluginCreator___pluginOptions___short_name = 'pluginCreator___pluginOptions___short_name',
  pluginCreator___pluginOptions___start_url = 'pluginCreator___pluginOptions___start_url',
  pluginCreator___pluginOptions___background_color = 'pluginCreator___pluginOptions___background_color',
  pluginCreator___pluginOptions___theme_color = 'pluginCreator___pluginOptions___theme_color',
  pluginCreator___pluginOptions___icon = 'pluginCreator___pluginOptions___icon',
  pluginCreator___pluginOptions___exclude = 'pluginCreator___pluginOptions___exclude',
  pluginCreator___pluginOptions___query = 'pluginCreator___pluginOptions___query',
  pluginCreator___pluginOptions___feeds = 'pluginCreator___pluginOptions___feeds',
  pluginCreator___pluginOptions___feeds___query = 'pluginCreator___pluginOptions___feeds___query',
  pluginCreator___pluginOptions___feeds___output = 'pluginCreator___pluginOptions___feeds___output',
  pluginCreator___pluginOptions___feeds___title = 'pluginCreator___pluginOptions___feeds___title',
  pluginCreator___pluginOptions___pathCheck = 'pluginCreator___pluginOptions___pathCheck',
  pluginCreator___nodeAPIs = 'pluginCreator___nodeAPIs',
  pluginCreator___browserAPIs = 'pluginCreator___browserAPIs',
  pluginCreator___ssrAPIs = 'pluginCreator___ssrAPIs',
  pluginCreator___pluginFilepath = 'pluginCreator___pluginFilepath',
  pluginCreator___packageJson___name = 'pluginCreator___packageJson___name',
  pluginCreator___packageJson___description = 'pluginCreator___packageJson___description',
  pluginCreator___packageJson___version = 'pluginCreator___packageJson___version',
  pluginCreator___packageJson___main = 'pluginCreator___packageJson___main',
  pluginCreator___packageJson___author = 'pluginCreator___packageJson___author',
  pluginCreator___packageJson___license = 'pluginCreator___packageJson___license',
  pluginCreator___packageJson___dependencies = 'pluginCreator___packageJson___dependencies',
  pluginCreator___packageJson___dependencies___name = 'pluginCreator___packageJson___dependencies___name',
  pluginCreator___packageJson___dependencies___version = 'pluginCreator___packageJson___dependencies___version',
  pluginCreator___packageJson___devDependencies = 'pluginCreator___packageJson___devDependencies',
  pluginCreator___packageJson___devDependencies___name = 'pluginCreator___packageJson___devDependencies___name',
  pluginCreator___packageJson___devDependencies___version = 'pluginCreator___packageJson___devDependencies___version',
  pluginCreator___packageJson___peerDependencies = 'pluginCreator___packageJson___peerDependencies',
  pluginCreator___packageJson___peerDependencies___name = 'pluginCreator___packageJson___peerDependencies___name',
  pluginCreator___packageJson___peerDependencies___version = 'pluginCreator___packageJson___peerDependencies___version',
  pluginCreator___packageJson___keywords = 'pluginCreator___packageJson___keywords',
  pluginCreatorId = 'pluginCreatorId',
  componentPath = 'componentPath'
}

export type SitePageFilterInput = {
  readonly id?: Maybe<StringQueryOperatorInput>,
  readonly parent?: Maybe<NodeFilterInput>,
  readonly children?: Maybe<NodeFilterListInput>,
  readonly internal?: Maybe<InternalFilterInput>,
  readonly path?: Maybe<StringQueryOperatorInput>,
  readonly internalComponentName?: Maybe<StringQueryOperatorInput>,
  readonly component?: Maybe<StringQueryOperatorInput>,
  readonly componentChunkName?: Maybe<StringQueryOperatorInput>,
  readonly isCreatedByStatefulCreatePages?: Maybe<BooleanQueryOperatorInput>,
  readonly context?: Maybe<SitePageContextFilterInput>,
  readonly pluginCreator?: Maybe<SitePluginFilterInput>,
  readonly pluginCreatorId?: Maybe<StringQueryOperatorInput>,
  readonly componentPath?: Maybe<StringQueryOperatorInput>,
};

export type SitePageGroupConnection = {
  readonly __typename?: 'SitePageGroupConnection',
  readonly totalCount: Scalars['Int'],
  readonly edges: ReadonlyArray<SitePageEdge>,
  readonly nodes: ReadonlyArray<SitePage>,
  readonly pageInfo: PageInfo,
  readonly field: Scalars['String'],
  readonly fieldValue?: Maybe<Scalars['String']>,
};

export type SitePageSortInput = {
  readonly fields?: Maybe<ReadonlyArray<Maybe<SitePageFieldsEnum>>>,
  readonly order?: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>,
};

export type SitePlugin = Node & {
  readonly __typename?: 'SitePlugin',
  readonly id: Scalars['ID'],
  readonly parent?: Maybe<Node>,
  readonly children: ReadonlyArray<Node>,
  readonly internal: Internal,
  readonly resolve?: Maybe<Scalars['String']>,
  readonly name?: Maybe<Scalars['String']>,
  readonly version?: Maybe<Scalars['String']>,
  readonly pluginOptions?: Maybe<SitePluginPluginOptions>,
  readonly nodeAPIs?: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>,
  readonly browserAPIs?: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>,
  readonly ssrAPIs?: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>,
  readonly pluginFilepath?: Maybe<Scalars['String']>,
  readonly packageJson?: Maybe<SitePluginPackageJson>,
};

export type SitePluginConnection = {
  readonly __typename?: 'SitePluginConnection',
  readonly totalCount: Scalars['Int'],
  readonly edges: ReadonlyArray<SitePluginEdge>,
  readonly nodes: ReadonlyArray<SitePlugin>,
  readonly pageInfo: PageInfo,
  readonly distinct: ReadonlyArray<Scalars['String']>,
  readonly group: ReadonlyArray<SitePluginGroupConnection>,
};


export type SitePluginConnectiondistinctArgs = {
  field: SitePluginFieldsEnum
};


export type SitePluginConnectiongroupArgs = {
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  field: SitePluginFieldsEnum
};

export type SitePluginEdge = {
  readonly __typename?: 'SitePluginEdge',
  readonly next?: Maybe<SitePlugin>,
  readonly node: SitePlugin,
  readonly previous?: Maybe<SitePlugin>,
};

export enum SitePluginFieldsEnum {
  id = 'id',
  parent___id = 'parent___id',
  parent___parent___id = 'parent___parent___id',
  parent___parent___parent___id = 'parent___parent___parent___id',
  parent___parent___parent___children = 'parent___parent___parent___children',
  parent___parent___children = 'parent___parent___children',
  parent___parent___children___id = 'parent___parent___children___id',
  parent___parent___children___children = 'parent___parent___children___children',
  parent___parent___internal___content = 'parent___parent___internal___content',
  parent___parent___internal___contentDigest = 'parent___parent___internal___contentDigest',
  parent___parent___internal___description = 'parent___parent___internal___description',
  parent___parent___internal___fieldOwners = 'parent___parent___internal___fieldOwners',
  parent___parent___internal___ignoreType = 'parent___parent___internal___ignoreType',
  parent___parent___internal___mediaType = 'parent___parent___internal___mediaType',
  parent___parent___internal___owner = 'parent___parent___internal___owner',
  parent___parent___internal___type = 'parent___parent___internal___type',
  parent___children = 'parent___children',
  parent___children___id = 'parent___children___id',
  parent___children___parent___id = 'parent___children___parent___id',
  parent___children___parent___children = 'parent___children___parent___children',
  parent___children___children = 'parent___children___children',
  parent___children___children___id = 'parent___children___children___id',
  parent___children___children___children = 'parent___children___children___children',
  parent___children___internal___content = 'parent___children___internal___content',
  parent___children___internal___contentDigest = 'parent___children___internal___contentDigest',
  parent___children___internal___description = 'parent___children___internal___description',
  parent___children___internal___fieldOwners = 'parent___children___internal___fieldOwners',
  parent___children___internal___ignoreType = 'parent___children___internal___ignoreType',
  parent___children___internal___mediaType = 'parent___children___internal___mediaType',
  parent___children___internal___owner = 'parent___children___internal___owner',
  parent___children___internal___type = 'parent___children___internal___type',
  parent___internal___content = 'parent___internal___content',
  parent___internal___contentDigest = 'parent___internal___contentDigest',
  parent___internal___description = 'parent___internal___description',
  parent___internal___fieldOwners = 'parent___internal___fieldOwners',
  parent___internal___ignoreType = 'parent___internal___ignoreType',
  parent___internal___mediaType = 'parent___internal___mediaType',
  parent___internal___owner = 'parent___internal___owner',
  parent___internal___type = 'parent___internal___type',
  children = 'children',
  children___id = 'children___id',
  children___parent___id = 'children___parent___id',
  children___parent___parent___id = 'children___parent___parent___id',
  children___parent___parent___children = 'children___parent___parent___children',
  children___parent___children = 'children___parent___children',
  children___parent___children___id = 'children___parent___children___id',
  children___parent___children___children = 'children___parent___children___children',
  children___parent___internal___content = 'children___parent___internal___content',
  children___parent___internal___contentDigest = 'children___parent___internal___contentDigest',
  children___parent___internal___description = 'children___parent___internal___description',
  children___parent___internal___fieldOwners = 'children___parent___internal___fieldOwners',
  children___parent___internal___ignoreType = 'children___parent___internal___ignoreType',
  children___parent___internal___mediaType = 'children___parent___internal___mediaType',
  children___parent___internal___owner = 'children___parent___internal___owner',
  children___parent___internal___type = 'children___parent___internal___type',
  children___children = 'children___children',
  children___children___id = 'children___children___id',
  children___children___parent___id = 'children___children___parent___id',
  children___children___parent___children = 'children___children___parent___children',
  children___children___children = 'children___children___children',
  children___children___children___id = 'children___children___children___id',
  children___children___children___children = 'children___children___children___children',
  children___children___internal___content = 'children___children___internal___content',
  children___children___internal___contentDigest = 'children___children___internal___contentDigest',
  children___children___internal___description = 'children___children___internal___description',
  children___children___internal___fieldOwners = 'children___children___internal___fieldOwners',
  children___children___internal___ignoreType = 'children___children___internal___ignoreType',
  children___children___internal___mediaType = 'children___children___internal___mediaType',
  children___children___internal___owner = 'children___children___internal___owner',
  children___children___internal___type = 'children___children___internal___type',
  children___internal___content = 'children___internal___content',
  children___internal___contentDigest = 'children___internal___contentDigest',
  children___internal___description = 'children___internal___description',
  children___internal___fieldOwners = 'children___internal___fieldOwners',
  children___internal___ignoreType = 'children___internal___ignoreType',
  children___internal___mediaType = 'children___internal___mediaType',
  children___internal___owner = 'children___internal___owner',
  children___internal___type = 'children___internal___type',
  internal___content = 'internal___content',
  internal___contentDigest = 'internal___contentDigest',
  internal___description = 'internal___description',
  internal___fieldOwners = 'internal___fieldOwners',
  internal___ignoreType = 'internal___ignoreType',
  internal___mediaType = 'internal___mediaType',
  internal___owner = 'internal___owner',
  internal___type = 'internal___type',
  resolve = 'resolve',
  name = 'name',
  version = 'version',
  pluginOptions___extensions = 'pluginOptions___extensions',
  pluginOptions___commonmark = 'pluginOptions___commonmark',
  pluginOptions___gatsbyRemarkPlugins = 'pluginOptions___gatsbyRemarkPlugins',
  pluginOptions___gatsbyRemarkPlugins___resolve = 'pluginOptions___gatsbyRemarkPlugins___resolve',
  pluginOptions___gatsbyRemarkPlugins___options___maxWidth = 'pluginOptions___gatsbyRemarkPlugins___options___maxWidth',
  pluginOptions___gatsbyRemarkPlugins___options___linkImagesToOriginal = 'pluginOptions___gatsbyRemarkPlugins___options___linkImagesToOriginal',
  pluginOptions___gatsbyRemarkPlugins___options___pathPrefix = 'pluginOptions___gatsbyRemarkPlugins___options___pathPrefix',
  pluginOptions___gatsbyRemarkPlugins___options___wrapperStyle = 'pluginOptions___gatsbyRemarkPlugins___options___wrapperStyle',
  pluginOptions___gatsbyRemarkPlugins___options___backgroundColor = 'pluginOptions___gatsbyRemarkPlugins___options___backgroundColor',
  pluginOptions___gatsbyRemarkPlugins___options___showCaptions = 'pluginOptions___gatsbyRemarkPlugins___options___showCaptions',
  pluginOptions___gatsbyRemarkPlugins___options___markdownCaptions = 'pluginOptions___gatsbyRemarkPlugins___options___markdownCaptions',
  pluginOptions___gatsbyRemarkPlugins___options___withWebp = 'pluginOptions___gatsbyRemarkPlugins___options___withWebp',
  pluginOptions___gatsbyRemarkPlugins___options___tracedSVG = 'pluginOptions___gatsbyRemarkPlugins___options___tracedSVG',
  pluginOptions___gatsbyRemarkPlugins___options___loading = 'pluginOptions___gatsbyRemarkPlugins___options___loading',
  pluginOptions___gatsbyRemarkPlugins___options___disableBgImageOnAlpha = 'pluginOptions___gatsbyRemarkPlugins___options___disableBgImageOnAlpha',
  pluginOptions___gatsbyRemarkPlugins___options___disableBgImage = 'pluginOptions___gatsbyRemarkPlugins___options___disableBgImage',
  pluginOptions___gatsbyRemarkPlugins___options___icon = 'pluginOptions___gatsbyRemarkPlugins___options___icon',
  pluginOptions___gatsbyRemarkPlugins___options___extensionDataDirectory = 'pluginOptions___gatsbyRemarkPlugins___options___extensionDataDirectory',
  pluginOptions___gatsbyRemarkPlugins___options___injectStyles = 'pluginOptions___gatsbyRemarkPlugins___options___injectStyles',
  pluginOptions___gatsbyRemarkPlugins___options___colorTheme = 'pluginOptions___gatsbyRemarkPlugins___options___colorTheme',
  pluginOptions___gatsbyRemarkPlugins___options___extensions = 'pluginOptions___gatsbyRemarkPlugins___options___extensions',
  pluginOptions___defaultLayouts___posts = 'pluginOptions___defaultLayouts___posts',
  pluginOptions___path = 'pluginOptions___path',
  pluginOptions___name = 'pluginOptions___name',
  pluginOptions___allowNamespaces = 'pluginOptions___allowNamespaces',
  pluginOptions___localSchemaFile = 'pluginOptions___localSchemaFile',
  pluginOptions___short_name = 'pluginOptions___short_name',
  pluginOptions___start_url = 'pluginOptions___start_url',
  pluginOptions___background_color = 'pluginOptions___background_color',
  pluginOptions___theme_color = 'pluginOptions___theme_color',
  pluginOptions___icon = 'pluginOptions___icon',
  pluginOptions___exclude = 'pluginOptions___exclude',
  pluginOptions___query = 'pluginOptions___query',
  pluginOptions___feeds = 'pluginOptions___feeds',
  pluginOptions___feeds___query = 'pluginOptions___feeds___query',
  pluginOptions___feeds___output = 'pluginOptions___feeds___output',
  pluginOptions___feeds___title = 'pluginOptions___feeds___title',
  pluginOptions___pathCheck = 'pluginOptions___pathCheck',
  nodeAPIs = 'nodeAPIs',
  browserAPIs = 'browserAPIs',
  ssrAPIs = 'ssrAPIs',
  pluginFilepath = 'pluginFilepath',
  packageJson___name = 'packageJson___name',
  packageJson___description = 'packageJson___description',
  packageJson___version = 'packageJson___version',
  packageJson___main = 'packageJson___main',
  packageJson___author = 'packageJson___author',
  packageJson___license = 'packageJson___license',
  packageJson___dependencies = 'packageJson___dependencies',
  packageJson___dependencies___name = 'packageJson___dependencies___name',
  packageJson___dependencies___version = 'packageJson___dependencies___version',
  packageJson___devDependencies = 'packageJson___devDependencies',
  packageJson___devDependencies___name = 'packageJson___devDependencies___name',
  packageJson___devDependencies___version = 'packageJson___devDependencies___version',
  packageJson___peerDependencies = 'packageJson___peerDependencies',
  packageJson___peerDependencies___name = 'packageJson___peerDependencies___name',
  packageJson___peerDependencies___version = 'packageJson___peerDependencies___version',
  packageJson___keywords = 'packageJson___keywords'
}

export type SitePluginFilterInput = {
  readonly id?: Maybe<StringQueryOperatorInput>,
  readonly parent?: Maybe<NodeFilterInput>,
  readonly children?: Maybe<NodeFilterListInput>,
  readonly internal?: Maybe<InternalFilterInput>,
  readonly resolve?: Maybe<StringQueryOperatorInput>,
  readonly name?: Maybe<StringQueryOperatorInput>,
  readonly version?: Maybe<StringQueryOperatorInput>,
  readonly pluginOptions?: Maybe<SitePluginPluginOptionsFilterInput>,
  readonly nodeAPIs?: Maybe<StringQueryOperatorInput>,
  readonly browserAPIs?: Maybe<StringQueryOperatorInput>,
  readonly ssrAPIs?: Maybe<StringQueryOperatorInput>,
  readonly pluginFilepath?: Maybe<StringQueryOperatorInput>,
  readonly packageJson?: Maybe<SitePluginPackageJsonFilterInput>,
};

export type SitePluginGroupConnection = {
  readonly __typename?: 'SitePluginGroupConnection',
  readonly totalCount: Scalars['Int'],
  readonly edges: ReadonlyArray<SitePluginEdge>,
  readonly nodes: ReadonlyArray<SitePlugin>,
  readonly pageInfo: PageInfo,
  readonly field: Scalars['String'],
  readonly fieldValue?: Maybe<Scalars['String']>,
};

export type SitePluginPackageJson = {
  readonly __typename?: 'SitePluginPackageJson',
  readonly name?: Maybe<Scalars['String']>,
  readonly description?: Maybe<Scalars['String']>,
  readonly version?: Maybe<Scalars['String']>,
  readonly main?: Maybe<Scalars['String']>,
  readonly author?: Maybe<Scalars['String']>,
  readonly license?: Maybe<Scalars['String']>,
  readonly dependencies?: Maybe<ReadonlyArray<Maybe<SitePluginPackageJsonDependencies>>>,
  readonly devDependencies?: Maybe<ReadonlyArray<Maybe<SitePluginPackageJsonDevDependencies>>>,
  readonly peerDependencies?: Maybe<ReadonlyArray<Maybe<SitePluginPackageJsonPeerDependencies>>>,
  readonly keywords?: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>,
};

export type SitePluginPackageJsonDependencies = {
  readonly __typename?: 'SitePluginPackageJsonDependencies',
  readonly name?: Maybe<Scalars['String']>,
  readonly version?: Maybe<Scalars['String']>,
};

export type SitePluginPackageJsonDependenciesFilterInput = {
  readonly name?: Maybe<StringQueryOperatorInput>,
  readonly version?: Maybe<StringQueryOperatorInput>,
};

export type SitePluginPackageJsonDependenciesFilterListInput = {
  readonly elemMatch?: Maybe<SitePluginPackageJsonDependenciesFilterInput>,
};

export type SitePluginPackageJsonDevDependencies = {
  readonly __typename?: 'SitePluginPackageJsonDevDependencies',
  readonly name?: Maybe<Scalars['String']>,
  readonly version?: Maybe<Scalars['String']>,
};

export type SitePluginPackageJsonDevDependenciesFilterInput = {
  readonly name?: Maybe<StringQueryOperatorInput>,
  readonly version?: Maybe<StringQueryOperatorInput>,
};

export type SitePluginPackageJsonDevDependenciesFilterListInput = {
  readonly elemMatch?: Maybe<SitePluginPackageJsonDevDependenciesFilterInput>,
};

export type SitePluginPackageJsonFilterInput = {
  readonly name?: Maybe<StringQueryOperatorInput>,
  readonly description?: Maybe<StringQueryOperatorInput>,
  readonly version?: Maybe<StringQueryOperatorInput>,
  readonly main?: Maybe<StringQueryOperatorInput>,
  readonly author?: Maybe<StringQueryOperatorInput>,
  readonly license?: Maybe<StringQueryOperatorInput>,
  readonly dependencies?: Maybe<SitePluginPackageJsonDependenciesFilterListInput>,
  readonly devDependencies?: Maybe<SitePluginPackageJsonDevDependenciesFilterListInput>,
  readonly peerDependencies?: Maybe<SitePluginPackageJsonPeerDependenciesFilterListInput>,
  readonly keywords?: Maybe<StringQueryOperatorInput>,
};

export type SitePluginPackageJsonPeerDependencies = {
  readonly __typename?: 'SitePluginPackageJsonPeerDependencies',
  readonly name?: Maybe<Scalars['String']>,
  readonly version?: Maybe<Scalars['String']>,
};

export type SitePluginPackageJsonPeerDependenciesFilterInput = {
  readonly name?: Maybe<StringQueryOperatorInput>,
  readonly version?: Maybe<StringQueryOperatorInput>,
};

export type SitePluginPackageJsonPeerDependenciesFilterListInput = {
  readonly elemMatch?: Maybe<SitePluginPackageJsonPeerDependenciesFilterInput>,
};

export type SitePluginPluginOptions = {
  readonly __typename?: 'SitePluginPluginOptions',
  readonly extensions?: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>,
  readonly commonmark?: Maybe<Scalars['Boolean']>,
  readonly gatsbyRemarkPlugins?: Maybe<ReadonlyArray<Maybe<SitePluginPluginOptionsGatsbyRemarkPlugins>>>,
  readonly defaultLayouts?: Maybe<SitePluginPluginOptionsDefaultLayouts>,
  readonly path?: Maybe<Scalars['String']>,
  readonly name?: Maybe<Scalars['String']>,
  readonly allowNamespaces?: Maybe<Scalars['Boolean']>,
  readonly localSchemaFile?: Maybe<Scalars['String']>,
  readonly short_name?: Maybe<Scalars['String']>,
  readonly start_url?: Maybe<Scalars['String']>,
  readonly background_color?: Maybe<Scalars['String']>,
  readonly theme_color?: Maybe<Scalars['String']>,
  readonly icon?: Maybe<Scalars['String']>,
  readonly exclude?: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>,
  readonly query?: Maybe<Scalars['String']>,
  readonly feeds?: Maybe<ReadonlyArray<Maybe<SitePluginPluginOptionsFeeds>>>,
  readonly pathCheck?: Maybe<Scalars['Boolean']>,
};

export type SitePluginPluginOptionsDefaultLayouts = {
  readonly __typename?: 'SitePluginPluginOptionsDefaultLayouts',
  readonly posts?: Maybe<Scalars['String']>,
};

export type SitePluginPluginOptionsDefaultLayoutsFilterInput = {
  readonly posts?: Maybe<StringQueryOperatorInput>,
};

export type SitePluginPluginOptionsFeeds = {
  readonly __typename?: 'SitePluginPluginOptionsFeeds',
  readonly query?: Maybe<Scalars['String']>,
  readonly output?: Maybe<Scalars['String']>,
  readonly title?: Maybe<Scalars['String']>,
};

export type SitePluginPluginOptionsFeedsFilterInput = {
  readonly query?: Maybe<StringQueryOperatorInput>,
  readonly output?: Maybe<StringQueryOperatorInput>,
  readonly title?: Maybe<StringQueryOperatorInput>,
};

export type SitePluginPluginOptionsFeedsFilterListInput = {
  readonly elemMatch?: Maybe<SitePluginPluginOptionsFeedsFilterInput>,
};

export type SitePluginPluginOptionsFilterInput = {
  readonly extensions?: Maybe<StringQueryOperatorInput>,
  readonly commonmark?: Maybe<BooleanQueryOperatorInput>,
  readonly gatsbyRemarkPlugins?: Maybe<SitePluginPluginOptionsGatsbyRemarkPluginsFilterListInput>,
  readonly defaultLayouts?: Maybe<SitePluginPluginOptionsDefaultLayoutsFilterInput>,
  readonly path?: Maybe<StringQueryOperatorInput>,
  readonly name?: Maybe<StringQueryOperatorInput>,
  readonly allowNamespaces?: Maybe<BooleanQueryOperatorInput>,
  readonly localSchemaFile?: Maybe<StringQueryOperatorInput>,
  readonly short_name?: Maybe<StringQueryOperatorInput>,
  readonly start_url?: Maybe<StringQueryOperatorInput>,
  readonly background_color?: Maybe<StringQueryOperatorInput>,
  readonly theme_color?: Maybe<StringQueryOperatorInput>,
  readonly icon?: Maybe<StringQueryOperatorInput>,
  readonly exclude?: Maybe<StringQueryOperatorInput>,
  readonly query?: Maybe<StringQueryOperatorInput>,
  readonly feeds?: Maybe<SitePluginPluginOptionsFeedsFilterListInput>,
  readonly pathCheck?: Maybe<BooleanQueryOperatorInput>,
};

export type SitePluginPluginOptionsGatsbyRemarkPlugins = {
  readonly __typename?: 'SitePluginPluginOptionsGatsbyRemarkPlugins',
  readonly resolve?: Maybe<Scalars['String']>,
  readonly options?: Maybe<SitePluginPluginOptionsGatsbyRemarkPluginsOptions>,
};

export type SitePluginPluginOptionsGatsbyRemarkPluginsFilterInput = {
  readonly resolve?: Maybe<StringQueryOperatorInput>,
  readonly options?: Maybe<SitePluginPluginOptionsGatsbyRemarkPluginsOptionsFilterInput>,
};

export type SitePluginPluginOptionsGatsbyRemarkPluginsFilterListInput = {
  readonly elemMatch?: Maybe<SitePluginPluginOptionsGatsbyRemarkPluginsFilterInput>,
};

export type SitePluginPluginOptionsGatsbyRemarkPluginsOptions = {
  readonly __typename?: 'SitePluginPluginOptionsGatsbyRemarkPluginsOptions',
  readonly maxWidth?: Maybe<Scalars['Int']>,
  readonly linkImagesToOriginal?: Maybe<Scalars['Boolean']>,
  readonly pathPrefix?: Maybe<Scalars['String']>,
  readonly wrapperStyle?: Maybe<Scalars['String']>,
  readonly backgroundColor?: Maybe<Scalars['String']>,
  readonly showCaptions?: Maybe<Scalars['Boolean']>,
  readonly markdownCaptions?: Maybe<Scalars['Boolean']>,
  readonly withWebp?: Maybe<Scalars['Boolean']>,
  readonly tracedSVG?: Maybe<Scalars['Boolean']>,
  readonly loading?: Maybe<Scalars['String']>,
  readonly disableBgImageOnAlpha?: Maybe<Scalars['Boolean']>,
  readonly disableBgImage?: Maybe<Scalars['Boolean']>,
  readonly icon?: Maybe<Scalars['String']>,
  readonly extensionDataDirectory?: Maybe<Scalars['String']>,
  readonly injectStyles?: Maybe<Scalars['Boolean']>,
  readonly colorTheme?: Maybe<Scalars['String']>,
  readonly extensions?: Maybe<ReadonlyArray<Maybe<SitePluginPluginOptionsGatsbyRemarkPluginsOptionsExtensions>>>,
};

export type SitePluginPluginOptionsGatsbyRemarkPluginsOptionsExtensions = {
  readonly __typename?: 'SitePluginPluginOptionsGatsbyRemarkPluginsOptionsExtensions',
  readonly identifier?: Maybe<Scalars['String']>,
  readonly version?: Maybe<Scalars['String']>,
};

export type SitePluginPluginOptionsGatsbyRemarkPluginsOptionsExtensionsFilterInput = {
  readonly identifier?: Maybe<StringQueryOperatorInput>,
  readonly version?: Maybe<StringQueryOperatorInput>,
};

export type SitePluginPluginOptionsGatsbyRemarkPluginsOptionsExtensionsFilterListInput = {
  readonly elemMatch?: Maybe<SitePluginPluginOptionsGatsbyRemarkPluginsOptionsExtensionsFilterInput>,
};

export type SitePluginPluginOptionsGatsbyRemarkPluginsOptionsFilterInput = {
  readonly maxWidth?: Maybe<IntQueryOperatorInput>,
  readonly linkImagesToOriginal?: Maybe<BooleanQueryOperatorInput>,
  readonly pathPrefix?: Maybe<StringQueryOperatorInput>,
  readonly wrapperStyle?: Maybe<StringQueryOperatorInput>,
  readonly backgroundColor?: Maybe<StringQueryOperatorInput>,
  readonly showCaptions?: Maybe<BooleanQueryOperatorInput>,
  readonly markdownCaptions?: Maybe<BooleanQueryOperatorInput>,
  readonly withWebp?: Maybe<BooleanQueryOperatorInput>,
  readonly tracedSVG?: Maybe<BooleanQueryOperatorInput>,
  readonly loading?: Maybe<StringQueryOperatorInput>,
  readonly disableBgImageOnAlpha?: Maybe<BooleanQueryOperatorInput>,
  readonly disableBgImage?: Maybe<BooleanQueryOperatorInput>,
  readonly icon?: Maybe<StringQueryOperatorInput>,
  readonly extensionDataDirectory?: Maybe<StringQueryOperatorInput>,
  readonly injectStyles?: Maybe<BooleanQueryOperatorInput>,
  readonly colorTheme?: Maybe<StringQueryOperatorInput>,
  readonly extensions?: Maybe<SitePluginPluginOptionsGatsbyRemarkPluginsOptionsExtensionsFilterListInput>,
};

export type SitePluginSortInput = {
  readonly fields?: Maybe<ReadonlyArray<Maybe<SitePluginFieldsEnum>>>,
  readonly order?: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>,
};

export type SiteSiteMetadata = {
  readonly __typename?: 'SiteSiteMetadata',
  readonly title?: Maybe<Scalars['String']>,
  readonly titleTemplate?: Maybe<Scalars['String']>,
  readonly author?: Maybe<Scalars['String']>,
  readonly description?: Maybe<Scalars['String']>,
  readonly social?: Maybe<ReadonlyArray<Maybe<SiteSiteMetadataSocial>>>,
  readonly siteUrl?: Maybe<Scalars['String']>,
  readonly htmlAttributes?: Maybe<SiteSiteMetadataHtmlAttributes>,
  readonly twitterUsername?: Maybe<Scalars['String']>,
};

export type SiteSiteMetadataFilterInput = {
  readonly title?: Maybe<StringQueryOperatorInput>,
  readonly titleTemplate?: Maybe<StringQueryOperatorInput>,
  readonly author?: Maybe<StringQueryOperatorInput>,
  readonly description?: Maybe<StringQueryOperatorInput>,
  readonly social?: Maybe<SiteSiteMetadataSocialFilterListInput>,
  readonly siteUrl?: Maybe<StringQueryOperatorInput>,
  readonly htmlAttributes?: Maybe<SiteSiteMetadataHtmlAttributesFilterInput>,
  readonly twitterUsername?: Maybe<StringQueryOperatorInput>,
};

export type SiteSiteMetadataHtmlAttributes = {
  readonly __typename?: 'SiteSiteMetadataHtmlAttributes',
  readonly lang?: Maybe<Scalars['String']>,
};

export type SiteSiteMetadataHtmlAttributesFilterInput = {
  readonly lang?: Maybe<StringQueryOperatorInput>,
};

export type SiteSiteMetadataSocial = {
  readonly __typename?: 'SiteSiteMetadataSocial',
  readonly name?: Maybe<Scalars['String']>,
  readonly url?: Maybe<Scalars['String']>,
};

export type SiteSiteMetadataSocialFilterInput = {
  readonly name?: Maybe<StringQueryOperatorInput>,
  readonly url?: Maybe<StringQueryOperatorInput>,
};

export type SiteSiteMetadataSocialFilterListInput = {
  readonly elemMatch?: Maybe<SiteSiteMetadataSocialFilterInput>,
};

export type SiteSortInput = {
  readonly fields?: Maybe<ReadonlyArray<Maybe<SiteFieldsEnum>>>,
  readonly order?: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>,
};

export enum SortOrderEnum {
  ASC = 'ASC',
  DESC = 'DESC'
}

export type StringQueryOperatorInput = {
  readonly eq?: Maybe<Scalars['String']>,
  readonly ne?: Maybe<Scalars['String']>,
  readonly in?: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>,
  readonly nin?: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>,
  readonly regex?: Maybe<Scalars['String']>,
  readonly glob?: Maybe<Scalars['String']>,
};

export type Venue = {
  readonly __typename?: 'Venue',
  readonly name: Scalars['String'],
  readonly link?: Maybe<Scalars['String']>,
};

export type VenueFilterInput = {
  readonly name?: Maybe<StringQueryOperatorInput>,
  readonly link?: Maybe<StringQueryOperatorInput>,
};

export type VenueFilterListInput = {
  readonly elemMatch?: Maybe<VenueFilterInput>,
};
