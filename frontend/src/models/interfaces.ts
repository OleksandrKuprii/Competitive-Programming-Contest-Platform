import { Action, Computed, TargetResolver, Thunk, ThunkOn } from 'easy-peasy';
import Injections from '../injections';

/* <editor-fold desc="General"> */

export interface ObjectWithId<Identifier> extends StringIndexSignature {
  id: Identifier;
}

export interface StringIndexSignature {
  [key: string]: any;
}

export interface ObjectWithLoadingStatus {
  loading?: boolean;
}

/* </editor-fold> */

/* <editor-fold desc="StoreModel"> */

export interface StoreModel {
  auth0: Auth0Model;
  task: TaskModel;
  category: CategoryModel;
  submission: SubmissionModel;
  solutionSubmission: SolutionSubmissionModel;
  notification: NotificationModel;
  submissionHunter: SubmissionHunterModel;
  sort: SortModel;
  filter: FilterModel;
}

/* </editor-fold> */

/* <editor-fold desc="Auth0"> */
export interface Auth0ModelInitialState {
  isAuthenticated: boolean;
  user: any;
  username: string;
  avatar: string;
}

export interface Auth0Model extends Auth0ModelInitialState {
  signIn: Thunk<Auth0Model, undefined, Injections>;
  signOut: Thunk<Auth0Model, undefined, Injections>;
}
/* </editor-fold> */

/* <editor-fold desc="Models"> */

/* <editor-fold desc="LoadingModel"> */

export interface LoadingModel {
  flag: boolean;
  loading: Action<LoadingModel>;
  loaded: Action<LoadingModel>;
}

/* </editor-fold> */

/* <editor-fold desc="DataModel"> */

export interface DataModelItem<T>
  extends ObjectWithId<T>,
    ObjectWithLoadingStatus {}

export interface DataFetcherArgs {
  token?: string;
}

export interface DataModelFactoryArgs<
  Identifier,
  Item extends DataModelItem<any>
> {
  dataItemFetcher: (
    id: Identifier,
    args: DataFetcherArgs,
  ) => Promise<{ item: Item } | undefined>;
  dataRangeFetcher: (
    range: DataItemRangeIdentifier,
    args: DataFetcherArgs,
  ) => Promise<Array<{ item: Item }>>;

  onChangedOneTargets: TargetResolver<DataModel<Identifier, Item>, StoreModel>;
  onChangedManyTargets: TargetResolver<DataModel<Identifier, Item>, StoreModel>;

  dataModelIdentifier: string;
}

export type DataItemRangeIdentifier = {
  offset: number;
  number: number;
};

export interface DataModel<
  Identifier,
  DataItem extends ObjectWithId<Identifier>
> {
  loading: LoadingModel;

  items: Array<DataItem>;

  updated: Action<DataModel<Identifier, DataItem>, DataItem>;
  updatedMany: Action<DataModel<Identifier, DataItem>, DataItem[]>;

  fetchOne: Thunk<DataModel<Identifier, DataItem>, Identifier, Injections>;
  fetchRange: Thunk<
    DataModel<Identifier, DataItem>,
    DataItemRangeIdentifier,
    Injections
  >;

  onFetchedOne: ThunkOn<DataModel<Identifier, DataItem>>;
  onFetchedRange: ThunkOn<DataModel<Identifier, DataItem>>;

  onChangedOne: ThunkOn<
    DataModel<Identifier, DataItem>,
    Injections,
    StoreModel
  >;
  onChangedMany: ThunkOn<
    DataModel<Identifier, DataItem>,
    Injections,
    StoreModel
  >;

  byId: Computed<
    DataModel<Identifier, DataItem>,
    (id: Identifier) => DataItem | undefined
  >;
  nItemsById: Computed<
    DataModel<Identifier, DataItem>,
    (number: number) => DataItem[]
  >;
  nItemsByCustomKeys: Computed<
    DataModel<Identifier, DataItem>,
    (
      keys: {
        key: (item: DataItem) => string | number | undefined;
        option: AscDescOrNone;
      }[],
      filters?: { option: FilterOption; name: string }[],
      joinWith?: (item: DataItem) => object,
    ) => DataItem[]
  >;
}

/* </editor-fold> */

/* <editor-fold desc="TaskModel"> */

export interface TaskCustomSection {
  name: string;
  data: string;
}

export interface Task extends DataModelItem<string> {
  name?: string;
  category?: string;
  difficulty?: number;
  rating: TaskRating;
  description?: {
    main?: string;
    inputFormat?: string;
    outputFormat?: string;
  };
  examples?: TaskExample[];
  limits?: TaskLimits;
  customSections?: TaskCustomSection[];
  publishedAt?: Date;
}

export interface TaskRating {
  correct: number;
  partial: number;
  zero: number;
}

export interface TaskExample {
  input: string;
  output: string;
}

export interface TaskLimits {
  cpuTime: number;
  wallTime: number;
  memory: number;
}

export interface TaskModel extends DataModel<string, Task> {}

export interface JoinedTask extends Task {
  result: number;
  submissionId?: number;
  status?: string[];
}

/* </editor-fold> */

/* <editor-fold desc="SubmissionModel"> */

export interface SubmissionTest {
  status: string;
  points: number;
  cpuTime: number;
  realtime: number;
}

export interface Submission extends DataModelItem<number> {
  taskAlias?: string;
  language?: string;
  status?: string[];
  points?: number;
  submitted?: Date;
  tests?: SubmissionTest[];
  code?: string;
}

export interface SubmissionModel extends DataModel<number, Submission> {}

/* </editor-fold> */

/* <editor-fold desc="SubmissionHunter"> */

export interface SubmissionHunterModel {
  nowHunting: Set<number>;

  isHunting: Computed<
    SubmissionHunterModel,
    (id: number) => boolean,
    StoreModel
  >;

  startedHunting: Action<SubmissionHunterModel, number>;
  receivedResults: Action<SubmissionHunterModel, Submission>;

  onStartedHunting: ThunkOn<SubmissionHunterModel, Injections, StoreModel>;
  onSubmit: ThunkOn<SubmissionHunterModel, Injections, StoreModel>;
  onFetchedSubmissions: ThunkOn<SubmissionHunterModel, Injections, StoreModel>;
}

/* </editor-fold> */

/* <editor-fold desc="SolutionSubmissionModel"> */

export interface SolutionSubmissionModel {
  code?: string;
  filename?: string;
  language: string;

  fileUploaded: Computed<SolutionSubmissionModel, boolean>;

  loading: LoadingModel;

  selectedLanguage: Action<SolutionSubmissionModel, string>;
  uploadedFile: Action<
    SolutionSubmissionModel,
    { code: string; filename: string }
  >;
  canceled: Action<SolutionSubmissionModel>;
  onSubmitRequested: Action<SolutionSubmissionModel, string>;

  uploadFile: Thunk<SolutionSubmissionModel, File>;
  submit: Thunk<SolutionSubmissionModel, string, Injections>;
}

/* </editor-fold> */

/* <editor-fold desc="NotificationModel"> */

export type Notification = {
  id: number;
  payload:
    | {
        type: 'submitting';
        taskId: string;
      }
    | {
        type: 'submitted';
        submissionId: number;
      }
    | {
        type: 'receivedResults';
        submissionId: number;
        points: number;
        status: string[];
      };
};

export interface NotificationModel {
  list: Array<Notification>;

  receivedNotification: Action<NotificationModel, Notification>;
  dismissedNotification: Action<NotificationModel, number>;

  addNotificationAndRemoveAfterDelay: Thunk<
    NotificationModel,
    { notification: Notification; delay?: number }
  >;

  onSubmitRequested: ThunkOn<NotificationModel, Injections, StoreModel>;
  onSubmitted: ThunkOn<NotificationModel, Injections, StoreModel>;
  onReceivedResults: ThunkOn<NotificationModel, Injections, StoreModel>;
}

/* </editor-fold> */

/* <editor-fold desc="CategoryModel"> */

export interface Category extends DataModelItem<string> {
  name?: string;
}

export interface CategoryModel extends DataModel<string, Category> {}

/* </editor-fold> */

/* <editor-fold desc="SortModel"> */

export type AscDescOrNone = 'asc' | 'desc' | undefined;

export interface SortModel {
  options: Array<{
    tableName: string;
    name: string;
    option: AscDescOrNone;
    customGetter?: () => {};
  }>;

  toggleOption: Action<
    SortModel,
    { tableName: string; header: string; option: AscDescOrNone }
  >;

  getOption: Computed<
    SortModel,
    (tableName: string, header: string) => AscDescOrNone
  >;

  getKeys: Computed<
    SortModel,
    (
      tableName: string,
      defaultOption: { key: string; option: AscDescOrNone },
    ) => { key: (item: any) => any; option: AscDescOrNone }[]
  >;
}

/* </editor-fold> */

/* <editor-fold desc="FilterModel"> */

export type FilterOption =
  | string
  | number
  | boolean
  | { from: number; to: number };

export interface FilterModel {
  options: Array<{ tableName: string; name: string; option: FilterOption }>;

  changedOptions: Action<
    FilterModel,
    { tableName: string; name: string; value: FilterOption; remove?: boolean }[]
  >;

  deletedOption: Action<FilterModel, { tableName: string; name: string }>;

  getOption: Computed<
    FilterModel,
    (tableName: string, name: string) => FilterOption | undefined
  >;

  getOptions: Computed<
    FilterModel,
    (tableName: string) => { option: FilterOption; name: string }[]
  >;
}

/* </editor-fold> */

/* </editor-fold> */
