import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { Action, ActionOn, Computed, Thunk, ThunkOn } from 'easy-peasy';
import { Task } from '~/typings/entities/task';
import Category from '~/typings/entities/category';
import User from '~/typings/entities/user';
import { Submission } from '~/typings/entities/submission';
import Notification from '~/typings/entities/notification';
import MyProfileMeta from '~/models/myProfileMeta';

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

export enum Result {
  Correct,
  Partial,
  Zero,
  NotStarted
}

export interface FilterAndSortModel {
  difficultyRange: number[];
  categories: string[];
  results: Result[];

  sortBy: SortBy;
  order: number;

  selectedDifficultyRange: Action<FilterAndSortModel, number[]>;
  selectedCategories: Action<FilterAndSortModel, string[]>;
  toggledResult: Action<FilterAndSortModel, Result>;

  clearedFilters: Action<FilterAndSortModel>;

  selectedSortBy: Action<FilterAndSortModel, { sortBy: SortBy; order: number }>;
}

export interface LoadingModel {
  loadingStatus: boolean;
  loading: Action<LoadingModel>;
  loaded: Action<LoadingModel>;
}

export interface ProfileModel {
  email?: string;
  fullname?: string;
  username?: string;

  country?: string;
  city?: string;
  school?: string;

  birthDay?: number;
  birthMonth?: number;
  birthYear?: number;

  bio?: string;
}

export interface MyProfileEditModel extends ProfileModel, Auth0Token, LoadingModel {
  onEmailChange: Action<MyProfileEditModel, string>;
  onUsernameChange: Action<MyProfileEditModel, string>;
  onFullnameChange: Action<MyProfileEditModel, string>;

  onCountryChange: Action<MyProfileEditModel, string>;
  onCityChange: Action<MyProfileEditModel, string>;
  onSchoolChange: Action<MyProfileEditModel, string>;

  onBirthDayChange: Action<MyProfileEditModel, number>;
  onBirthMonthChange: Action<MyProfileEditModel, number>;
  onBirthYearChange: Action<MyProfileEditModel, number>;

  onBioChange: Action<MyProfileEditModel, string>;

  onSave: Thunk<MyProfileEditModel>;
  onSaved: ThunkOn<MyProfileEditModel, undefined, StoreModel>;

  onFetchedMyProfile: ActionOn<MyProfileEditModel, StoreModel>;

  edited: Computed<MyProfileEditModel, boolean, StoreModel>;
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
  customFont: CustomFontModel;
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

  myProfileMeta?: MyProfileMeta;

  fetchMyProfile: Thunk<
    UserModel,
    undefined,
    undefined,
    StoreModel,
    Promise<[User, MyProfileMeta] | { error: boolean }>
  >;

  fetchedMyProfile: ActionOn<UserModel, StoreModel>;
}

export interface CustomFontModel {
  fontDelta: number;

  onFontDeltaUp: Action<CustomFontModel>;
  onFontDeltaDown: Action<CustomFontModel>;
}
