import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { Action, ActionOn, Computed, Thunk, ThunkOn } from 'easy-peasy';
import { Task } from '~/typings/entities/task';
import Category from '~/typings/entities/category';
import User from '~/typings/entities/user';
import { Submission } from '~/typings/entities/submission';
import Notification from '~/typings/entities/notification';

export interface Auth0Token {
  getToken: Thunk<Auth0Token, undefined, undefined, StoreModel>;
}

export interface Auth0Model extends LoadingModel {
  isAuthenticated: boolean;
  client?: Auth0Client;

  createdClient: Action<Auth0Model, Auth0Client>;
  authenticated: Action<Auth0Model>;

  signIn: Thunk<Auth0Model>;
  signOut: Thunk<Auth0Model>;
}

export enum SortBy {
  publishedAt = 'publishedAt',
  difficulty = 'difficulty',
}

export interface FilterAndSortModel {
  difficultyRange: number[];
  categories: string[];
  results: string[];

  sortBy: SortBy;
  order: number;

  selectedDifficultyRange: Action<FilterAndSortModel, number[]>;
  selectedCategories: Action<FilterAndSortModel, string[]>;
  selectedResults: Action<FilterAndSortModel, string[]>;

  selectedSortBy: Action<FilterAndSortModel, { sortBy: SortBy; order: number }>;
}

export interface LoadingModel {
  loadingStatus: boolean;
  loading: Action<LoadingModel>;
  loaded: Action<LoadingModel>;
}

export interface MyProfileEditModel {
  editing: boolean;

  fullname?: string;
}

export interface NotificationModel {
  list: Array<Notification>;

  receivedNotification: Action<NotificationModel, Notification>;
  dismissedNotification: Action<NotificationModel, number>;

  addNotificationAndRemoveAfterDelay: Thunk<
    NotificationModel,
    { notification: Notification; delay?: number }
  >;

  onSubmitRequested: ThunkOn<NotificationModel, undefined, StoreModel>;
  onSubmitted: ThunkOn<NotificationModel, undefined, StoreModel>;
  onReceivedResults: ThunkOn<NotificationModel, undefined, StoreModel>;
}

export interface SolutionSubmissionModel extends Auth0Token {
  code?: string;
  filename?: string;
  language: string;

  fileUploaded: Computed<SolutionSubmissionModel, boolean>;

  selectedLanguage: Action<SolutionSubmissionModel, string>;
  uploadedFile: Action<
    SolutionSubmissionModel,
    { code: string; filename: string }
  >;
  canceled: Action<SolutionSubmissionModel>;

  uploadFile: Thunk<SolutionSubmissionModel, File>;
  submit: Thunk<SolutionSubmissionModel, string, undefined, StoreModel>;
}

export interface StoreModel {
  auth0: Auth0Model;
  myProfileEdit: MyProfileEditModel;
  notification: NotificationModel;
  solutionSubmission: SolutionSubmissionModel;
  submission: SubmissionModel;
  submissionHunter: SubmissionHunterModel;
  task: TaskModel;
  user: UserModel;
  filterAndSort: FilterAndSortModel;
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

  onStartedHunting: ThunkOn<SubmissionHunterModel, undefined, StoreModel>;
  onSubmit: ThunkOn<SubmissionHunterModel, undefined, StoreModel>;

  onCheckSubmissions: ThunkOn<SubmissionHunterModel, undefined, StoreModel>;
}

export interface SubmissionModel extends LoadingModel, Auth0Token {
  submissions: Submission[];

  fetch: Thunk<
    SubmissionModel,
    { id: number },
    undefined,
    StoreModel,
    Promise<Submission | { error: boolean }>
  >;
  fetchAll: Thunk<
    SubmissionModel,
    undefined,
    undefined,
    StoreModel,
    Promise<Submission[] | { error: boolean }>
  >;

  onFetched: ActionOn<SubmissionModel, StoreModel>;
  onFetchedAll: ActionOn<SubmissionModel, StoreModel>;
  onSubmitted: ActionOn<SubmissionModel, StoreModel>;
}

export interface TaskModel extends LoadingModel, Auth0Token {
  tasks: Task[];

  fetch: Thunk<TaskModel, { id: string }, undefined, StoreModel, Promise<Task>>;

  fetchAll: Thunk<TaskModel, undefined, undefined, StoreModel, Promise<Task[]>>;

  onFetched: ActionOn<TaskModel, StoreModel>;
  onFetchedAll: ActionOn<TaskModel, StoreModel>;

  onReceivedResults: ActionOn<TaskModel, StoreModel>;

  categories: Computed<TaskModel, Category[], StoreModel>;
}

export interface UserModel extends LoadingModel, Auth0Token {
  myProfile?: User;

  fetchMyProfile: Thunk<
    UserModel,
    undefined,
    undefined,
    StoreModel,
    Promise<User | { error: boolean }>
  >;

  fetchedMyProfile: ActionOn<UserModel, StoreModel>;
}
