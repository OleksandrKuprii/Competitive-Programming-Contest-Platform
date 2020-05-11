import { Action, ActionOn, Computed, Thunk, ThunkOn } from 'easy-peasy';
import Injections from '~/injections';

export interface StoreModel {
  auth0: Auth0Model;
  myProfileEdit: MyProfileEditModel;
  notification: NotificationModel;
  solutionSubmission: SolutionSubmissionModel;
  submission: SubmissionModel;
  submissionHunter: SubmissionHunterModel;
  task: TaskModel;
  user: UserModel;
}

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

export interface LoadingModel {
  loadingStatus: boolean;
  loading: Action<LoadingModel>;
  loaded: Action<LoadingModel>;
}

export interface Task {
  id: string;
  name?: string;
  categoryId?: string;
  categoryName?: string;
  difficulty?: number;
  points?: number;
  status?: string[];
  submissionId?: number;
  rating?: TaskRating;
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

export interface TaskCustomSection {
  name: string;
  data: string;
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

export interface TaskModel extends LoadingModel {
  tasks: Task[];

  fetch: Thunk<
    TaskModel,
    { id: string },
    Injections,
    StoreModel,
    Promise<Task>
  >;

  fetchAll: Thunk<
    TaskModel,
    undefined,
    Injections,
    StoreModel,
    Promise<Task[]>
  >;

  onFetched: ActionOn<TaskModel, StoreModel>;
  onFetchedAll: ActionOn<TaskModel, StoreModel>;

  onReceivedResults: ActionOn<TaskModel, StoreModel>;

  categories: Computed<TaskModel, Category[], StoreModel>;
}

export interface SubmissionTest {
  id: number;
  status: string;
  points: number;
  cpuTime: number;
  realTime: number;
}

export interface Submission {
  id: number;
  code?: string;
  language?: string;
  points?: number;
  status?: string[];
  submitted?: Date;
  taskId?: string;
  taskName?: string;
  tests?: SubmissionTest[];
  testCount?: number;
}

export interface SubmissionModel extends LoadingModel {
  submissions: Submission[];

  fetch: Thunk<
    SubmissionModel,
    { id: number },
    Injections,
    StoreModel,
    Promise<Submission | { error: boolean }>
  >;
  fetchAll: Thunk<
    SubmissionModel,
    undefined,
    Injections,
    StoreModel,
    Promise<Submission[] | { error: boolean }>
  >;

  onFetched: ActionOn<SubmissionModel, StoreModel>;
  onFetchedAll: ActionOn<SubmissionModel, StoreModel>;
  onSubmitted: ActionOn<SubmissionModel, StoreModel>;
}

export interface SubmissionHunterModel {
  nowHunting: Set<number>;

  isHunting: Computed<
    SubmissionHunterModel,
    (id: number) => boolean,
    StoreModel
  >;

  startedHunting: Action<SubmissionHunterModel, number>;
  receivedResults: Action<SubmissionHunterModel, Submission>;

  checkSubmissions: Action<SubmissionHunterModel>;

  onStartedHunting: ThunkOn<SubmissionHunterModel, Injections, StoreModel>;
  onSubmit: ThunkOn<SubmissionHunterModel, Injections, StoreModel>;

  onCheckSubmissions: ThunkOn<SubmissionHunterModel, Injections, StoreModel>;
}

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

  uploadFile: Thunk<SolutionSubmissionModel, File>;
  submit: Thunk<SolutionSubmissionModel, string, Injections, StoreModel>;
}

export type Notification = {
  id: number;
  payload:
    | {
        type: 'submitting';
        taskId: string;
        taskName: string;
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

export interface Category {
  id: string;
  name: string;
}

export interface User {
  username: string;
  bio?: string;
  birthday?: Date;
  city?: string;
  country?: string;
  email?: string;
  fullname: string;
  picture?: string;
  school?: string;
  signupDate: Date;
}

export interface UserModel extends LoadingModel {
  myProfile?: User;

  fetchMyProfile: Thunk<
    UserModel,
    undefined,
    Injections,
    StoreModel,
    Promise<User | { error: boolean }>
  >;

  fetchedMyProfile: ActionOn<UserModel, StoreModel>;
}

export interface MyProfileEditModel {
  editing: boolean;

  fullname?: string;
}
