import { Action, Computed, TargetResolver, Thunk, ThunkOn } from 'easy-peasy';
import Injections from '../injections';

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

export type DataItemRangeIdentifier = { offset: number; number: number };

interface StringIndexSignature {
  [key: string]: any;
}

export interface ObjectWithId<Identifier> extends StringIndexSignature {
  id: Identifier;
}

export interface ObjectWithLoadingStatus {
  loading: boolean;
}

export interface DataModelItem<T> extends ObjectWithId<T>, ObjectWithLoadingStatus {}

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
}

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

export interface Category extends DataModelItem<String> {
  name?: string;
}

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

export interface LoadingModel {
  flag: boolean;
  loading: Action<LoadingModel>;
  loaded: Action<LoadingModel>;
}

export interface DataModel<Identifier, DataItem extends ObjectWithId<Identifier>> {
  loading: LoadingModel;

  items: Array<DataItem>;

  updated: Action<DataModel<Identifier, DataItem>, DataItem>;

  fetchOne: Thunk<DataModel<Identifier, DataItem>, Identifier, Injections>;
  fetchRange: Thunk<DataModel<Identifier, DataItem>, DataItemRangeIdentifier, Injections>;

  onFetchedOne: ThunkOn<DataModel<Identifier, DataItem>>;
  onFetchedRange: ThunkOn<DataModel<Identifier, DataItem>>;

  onChangedOne: ThunkOn<DataModel<Identifier, DataItem>, Injections, StoreModel>;
  onChangedMany: ThunkOn<DataModel<Identifier, DataItem>, Injections, StoreModel>;

  byId: Computed<DataModel<Identifier, DataItem>, (id: Identifier) => DataItem | undefined>;
  nItems: Computed<DataModel<Identifier, DataItem>, (number: number) => DataItem[]>;
}

export interface DataFetcherArgs {
  token?: string;
}

export interface DataModelFactoryArgs<Identifier, Item extends DataModelItem<any>> {
  dataItemFetcher: (id: Identifier, args: DataFetcherArgs) => Promise<{ item: Item } | undefined>;
  dataRangeFetcher: (
    range: DataItemRangeIdentifier,
    args: DataFetcherArgs,
  ) => Promise<Array<{ item: Item }>>;

  onChangedOneTargets: TargetResolver<DataModel<Identifier, Item>, StoreModel>;
  onChangedManyTargets: TargetResolver<DataModel<Identifier, Item>, StoreModel>;

  dataModelIdentifier: string;
}

export interface SubmissionModel extends DataModel<number, Submission> {}

export interface SubmissionHunterModel {
  nowHunting: Set<number>;

  isHunting: Computed<SubmissionHunterModel, (id: number) => boolean, StoreModel>;

  startedHunting: Action<SubmissionHunterModel, number>;
  receivedResults: Action<SubmissionHunterModel, Submission>;

  onSubmit: ThunkOn<SubmissionHunterModel, Injections, StoreModel>;
}

export interface TaskModel extends DataModel<string, Task> {}

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

export interface CategoryModel extends DataModel<String, Category> {}

export interface SolutionSubmissionModel {
  code?: string;
  filename?: string;
  language: string;

  fileUploaded: Computed<SolutionSubmissionModel, boolean>;

  loading: LoadingModel;

  selectedLanguage: Action<SolutionSubmissionModel, string>;
  uploadedFile: Action<SolutionSubmissionModel, { code: string; filename: string }>;
  canceled: Action<SolutionSubmissionModel>;
  onSubmitRequested: Action<SolutionSubmissionModel, string>;

  uploadFile: Thunk<SolutionSubmissionModel, File>;
  submit: Thunk<SolutionSubmissionModel, string, Injections>;
}

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

export interface StoreModel {
  auth0: Auth0Model;
  task: TaskModel;
  category: CategoryModel;
  submission: SubmissionModel;
  solutionSubmission: SolutionSubmissionModel;
  notification: NotificationModel;
  submissionHunter: SubmissionHunterModel;
}
