// ##################################################################
// Data structures for tecConfig <= roomle interaction
// ##################################################################

// History
// Date       | Author  | Description
// -----------|---------|--------------------------------------------
// 2024-04-19 | tb10kjo | Initial version
// 2024-06-20 | tb10kjo | Added "extrude/model" in PosPartData
// 2024-07-23 | tb10kjo | Added "insertLevelInfos/insertLevelFixed" to PosModuleRootData
// 2024-09-03 | tb10kjo | "PosGroup" now the main entry point for the calculation
//            |         | Added "libraryId" to PosGroup

// ##################################################################
// Article data (result for calling "calc")
// ##################################################################

export const enum PosUserRight {
  Simple = 'Simple',
  Advanced = 'Advanced',
  Master = 'Master',
}

// Add UserRightLevel for comparing rights
export const enum UserRightLevel {
  Simple = 0,
  Advanced = 1,
  Master = 2,
}

export const getUserRightLevel = (
  right?: PosUserRight | null
): UserRightLevel => {
  if (!right) {
    return UserRightLevel.Simple;
  }

  switch (right) {
    case PosUserRight.Simple:
      return UserRightLevel.Simple;
    case PosUserRight.Advanced:
      return UserRightLevel.Advanced;
    case PosUserRight.Master:
      return UserRightLevel.Master;
    default:
      return UserRightLevel.Simple;
  }
};

export interface PosArticleInfo {
  /**
   * Defined the library that is used / must match the MasterData
   */
  libraryId: string;

  /**
   * Defined the library that is used / must match the MasterData
   */
  catalog: string;

  /**
   * The id of the initial article
   */
  articleId: string;

  /**
   * The name of the initial article
   */
  articleName?: string;

  desc?: string;
  imageUrl?: string;
  category?: string;
}

export interface PosPartData {
  id: string; // The unique id of this part / an information only
  hidden?: boolean; // if set to "true"; then this part is not displayed
  relPos: number[]; // the relative position after the matrix was assigned (x/y/z) / it has always the size of 3
  dim: number[]; // the dimension (x/y/z) / it has always the size of 3
  fullMatrix: number[]; // Matrix4 array from three.js / it has always the size of 16
  openfullMatrix?: number[]; // Matrix4 array from three.js / it has always the size of 16 / is only present if this part has an "open" position
  name: string; // A name for information; this is NOT an id and NOT unique
  material?: PosFaceMaterial[] | string; // Material; currently only provided in the POC2... string type available for backwards compatibility
  extrude?: PosPartExtrudeInfo;
  model?: PosPartModelInfo; // 3D model of the part
  hideModelWhenOpen?: boolean; // Flag if model should be hidden when "opened" in viewer
  modelOpen?: PosPartModelInfo; // 3D model of the part when "opened" in viewer
}

export interface PosPartExtrudeInfo {
  svg: string; // The XML string of the SVG shape
  direction: string; // The direction of the extrusion (x, y, or z)
}

export interface PosFaceMaterial {
  materialId: string;
  faceKey?: PosFaceKey;
  uvRotation?: number; // rotation in degrees [0..360]
  uvOffset?: number[]; // 2D offset (u, v)
  uvScale?: number[]; // 2D scale (u, v)
}

export enum PosFaceKey {
  Default = 'default',
  Bottom = 'bottom',
  Top = 'top',
  Left = 'left',
  Right = 'right',
  Front = 'front',
  Back = 'back',
  Side = 'side',
}

export interface PosPartModelInfo {
  url: string; // The model of the OBJ file / the link is normally time limited (16 days)
  params?: string; // optional parameters for scaling/stretching/cutting the OBJ file  (we will add the documentation later to it)
}

export interface PosModuleAttribute {
  id: string; // The id of this attribute
  value?: number | string | boolean; // the value of this attribute
  isInput?: boolean; // defines if the attribute was passed as input into the calculation
}

export interface PosModuleData {
  id: string; // An unique id of this module; this is also stable across multiple calculation calls
  name: string; // A name for information; this is NOT an id and NOT unique
  modules?: PosModuleData[]; // possible sub modules
  parts?: PosPartData[]; // The assigned parts for this module (this is the OUTPUT)
  imageUrl?: string;
  attributes?: PosModuleAttribute[]; // This are the parameters of this module
  canBeDeleted?: boolean; // optional: If it is true, it can be deleted in the UI. If it is undefined or false, it cannot be deleted
  isGenerated?: boolean; // optional: If true, this module is a generation module
  checkAttributes?: Map<string, string | number | boolean | undefined>; // optional: Can contain the attributes required for validating checks
}

export interface PosModuleRootData extends PosModuleData, PosArticleInfo {
  /**
   * Additional text for this root module
   */
  additionalText?: string;

  /**
   * Position of this article; if not set it is always 0,0,0 (x/y/z)
   */
  articlePos?: number[];

  /**
   * Rotation on the vertical axis in degree (0-359)
   */
  rotationY?: number;

  // Also add orientation!
  // Local (error) messages
  logMessages: PosErrorMsg[];
  dockInfos: PosDockInfo[];

  // The insert level is suggested in the following list; if not list is present, the default height is the floor
  insertLevelInfos?: PosInsertLevelInfo[];
  // If this is set to `true` the suggestions cannot be overwritten
  insertLevelFixed?: boolean;
}

export interface PosInsertLevelInfo {
  height: number; // the height of the inertLevel
  isDefault?: boolean; // optionally: defines if this is default entry when a root-module is placed the first time
}

export interface PosDockInfo {
  id: PosDock;
  start: number[]; // the start position (x/y/z) related to the 0,0,0 point of this root module / 'end-start' is the direction vector
  end: number[]; // the end position (x/y/z) related to the 0,0,0 point of this root module/ 'end-start' is the direction vector
}

export const enum PosDock {
  RightTop = 'RightTop',
  BackTop = 'BackTop',
  LeftTop = 'LeftTop',
  RightBottom = 'RightBottom',
  BackBottom = 'BackBottom',
  LeftBottom = 'LeftBottom',
  LeftBackTop = 'LeftBackTop',
  RightBackTop = 'RightBackTop',
  LeftBackBottom = 'LeftBackBottom',
  RightBackBottom = 'RightBackBottom',
}

export interface PosErrorMsg {
  category: LogMessageCategoryType;
  msg: string;
  seqNo: number;
  timestamp: string;
  scope?: LogMessageScope;
}

export interface LogMessageScope {
  moduleUniqueId?: string;
  attrId?: string;
}

export const enum LogMessageCategoryType {
  Fatal = 'Fatal',
  Error = 'Error',
  Warning = 'Warning',
  Info = 'Info',
  Debug = 'Debug',
}

export interface PosContourSegment {
  cmd: string; // see SVG path: https://www.w3schools.com/graphics/svg_path.asp
  x: number;
  y: number;
  angle?: number;
  type?: string; // e.g. "wall"; can also be 'undefined' if it is free space
  height?: number;
  thickness?: number;
}

export interface PosContour {
  level: number;
  segments: PosContourSegment[];
}

export interface PosGroup {
  /**
   * The unique id of the Group
   */
  id: string;

  /**
   * One or multiple roots for this article group
   */
  roots: PosModuleRootData[];

  /**
   * Global (error) messages
   */
  logMessages: PosErrorMsg[];

  /**
   * Position/Orientation inside the room
   */
  /**
   * Optional a position of this group
   */
  pos?: number[];

  /**
   * The rotation on the vertical axis in degree (0-360)
   */
  rotationY?: number;

  /**
   * Optional a contour list of the surrounding elements
   */
  contours?: PosContour[];

  /**
   * The version used for this data structure
   */
  ver?: number;
}

export interface PosArticle extends PosArticleInfo {
  roots: PosModuleRootData[];
}

export interface PosSaveData {
  groups: PosGroup[];
  roomlePlannerId?: string;
  perspectiveImageLink?: string;
  topImageLink?: string;
  room3dLink?: string;
  room3dFullLink?: string;
}

export interface PosPriceData {
  Groups: PosPriceGroup[];
  LogMessages: PosErrorMsg[];
}

export interface PosPriceGroup {
  Id: string;
  Roots: PosRootPrice[];
}

export interface PosRootPrice {
  Id: string;
  TotalPrice?: number;
  Currency?: string;
}

export interface PosArticleCalculation {
  /**
   * Calculates the article group
   * @param article
   * @returns calc
   */
  calc(article: PosGroup): PosGroup; // calculates the article group
}

// ##################################################################
// Master data
// ##################################################################

export type MDAttributeSelection =
  | MDBoolAttributeSelection
  | MDTextAttributeSelection
  | MDIntegerAttributeSelection
  | MDRealAttributeSelection
  | MDDimAttributeSelection;

interface BaseAttributeSelection {
  imageUrl?: string;
  desc?: string;
  name?: string;
}

export interface MDBoolAttributeSelection extends BaseAttributeSelection {
  value?: boolean;
}

export interface MDTextAttributeSelection extends BaseAttributeSelection {
  value?: string;
}

export interface MDIntegerAttributeSelection extends BaseAttributeSelection {
  value?: number;
}

export interface MDRealAttributeSelection extends BaseAttributeSelection {
  value?: number;
}

export interface MDDimAttributeSelection extends BaseAttributeSelection {
  value?: number;
}

export interface MDNumberMinMaxAttributeSelection {
  min?: number;
  max?: string;
  desc?: string;
}

export const enum MDType {
  Dim = 'Dim',
  Integer = 'Integer',
  Real = 'Real',
  Bool = 'Bool',
  Text = 'Text',
}

export type MDAttributeInfo =
  | MDBoolAttributeInfo
  | MDTextAttributeInfo
  | MDIntegerAttributeInfo
  | MDRealAttributeInfo
  | MDDimAttributeInfo;

interface BaseMDAttributeInfo {
  id: string;
  name: string; // short name
  isMain?: boolean;
  desc?: string;
  group?: string;
  imageUrl?: string;
  type: MDType;
  userRight?: PosUserRight | null;
  userView?: string | null;
  implicitRelevant?: boolean; // defines if the attribute is implicit relevant;
  sorting?: number;
}

export interface MDBoolAttributeInfo extends BaseMDAttributeInfo {
  selections?: MDBoolAttributeSelection[];
  type: MDType.Bool;
}

export interface MDTextAttributeInfo extends BaseMDAttributeInfo {
  selections?: MDTextAttributeSelection[];
  type: MDType.Text;
}

export interface MDIntegerAttributeInfo extends BaseMDAttributeInfo {
  selections?: Array<| MDIntegerAttributeSelection
    | MDNumberMinMaxAttributeSelection>;
  type: MDType.Integer;
}

export interface MDRealAttributeInfo extends BaseMDAttributeInfo {
  selections?: Array<MDRealAttributeSelection | MDNumberMinMaxAttributeSelection>;
  type: MDType.Real;
}

export interface MDDimAttributeInfo extends BaseMDAttributeInfo {
  selections?: Array<MDDimAttributeSelection | MDNumberMinMaxAttributeSelection>;
  type: MDType.Dim;
}

export interface MDModuleInfo {
  id: string;
  name: string; // short name
  desc?: string;
  group?: string;
  imageUrl?: string;
  assignedAttributes: string[];
}

// Entry point
export interface MasterData {
  libraryId: string;
  modules: MDModuleInfo[];
  attributes: MDAttributeInfo[];
}
