import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
};

export type AchievementAward = {
  __typename?: 'AchievementAward';
  assets?: Maybe<Array<Asset>>;
  associatedWith: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isDeleted?: Maybe<Scalars['Boolean']['output']>;
  issuer: Scalars['String']['output'];
  issuerDate: Scalars['DateTimeISO']['output'];
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  profileId: Scalars['Float']['output'];
  recordedBy?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type AchievementAwardConnection = {
  __typename?: 'AchievementAwardConnection';
  edges: Array<AchievementAwardEdge>;
  pageInfo: PageInfo;
};

export type AchievementAwardEdge = {
  __typename?: 'AchievementAwardEdge';
  /** Used in `before` and `after` args */
  cursor: Scalars['String']['output'];
  node: AchievementAward;
};

export type AdditionalInfo = {
  __typename?: 'AdditionalInfo';
  coveringLetter?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  profileId: Scalars['Float']['output'];
  recordedBy?: Maybe<Scalars['String']['output']>;
  statementOfPurpose?: Maybe<Scalars['String']['output']>;
};

export type Asset = {
  __typename?: 'Asset';
  achievementAward: AchievementAward;
  desc: Scalars['String']['output'];
  fileType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  lastModifiedBy: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  recordedBy: Scalars['String']['output'];
  type: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
  workExperience: WorkExperience;
};

export type AssetConnection = {
  __typename?: 'AssetConnection';
  edges: Array<AssetEdge>;
  pageInfo: PageInfo;
};

export type AssetEdge = {
  __typename?: 'AssetEdge';
  /** Used in `before` and `after` args */
  cursor: Scalars['String']['output'];
  node: Asset;
};

export type AssetInput = {
  desc?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<AssetType>;
  url: Scalars['String']['input'];
};

export enum AssetType {
  Link = 'Link',
  Upload = 'Upload'
}

export type CandidateSkill = {
  __typename?: 'CandidateSkill';
  id: Scalars['ID']['output'];
  internship?: Maybe<Scalars['String']['output']>;
  isDeleted?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  profileId: Scalars['Float']['output'];
  recordedBy?: Maybe<Scalars['String']['output']>;
  workExperience?: Maybe<Scalars['String']['output']>;
};

export type CandidateSkillConnection = {
  __typename?: 'CandidateSkillConnection';
  edges: Array<CandidateSkillEdge>;
  pageInfo: PageInfo;
};

export type CandidateSkillEdge = {
  __typename?: 'CandidateSkillEdge';
  /** Used in `before` and `after` args */
  cursor: Scalars['String']['output'];
  node: CandidateSkill;
};

export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type City = {
  __typename?: 'City';
  id: Scalars['ID']['output'];
  lastModifiedBy: Scalars['String']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  recordedBy: Scalars['String']['output'];
  stateId: Scalars['Float']['output'];
  wikiDataId?: Maybe<Scalars['String']['output']>;
};

export type CityConnection = {
  __typename?: 'CityConnection';
  edges: Array<CityEdge>;
  pageInfo: PageInfo;
};

export type CityEdge = {
  __typename?: 'CityEdge';
  /** Used in `before` and `after` args */
  cursor: Scalars['String']['output'];
  node: City;
};

export type CompanyAdminInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  organisationName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type Country = {
  __typename?: 'Country';
  capital: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  currencyName: Scalars['String']['output'];
  currencySymbol: Scalars['String']['output'];
  emoji: Scalars['String']['output'];
  emojiU: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  iso2: Scalars['String']['output'];
  iso3: Scalars['String']['output'];
  lastModifiedBy: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  nationality: Scalars['String']['output'];
  native: Scalars['String']['output'];
  numericCode: Scalars['String']['output'];
  phoneCode: Scalars['String']['output'];
  recordedBy: Scalars['String']['output'];
  regionId: Scalars['Float']['output'];
  regionName: Scalars['String']['output'];
  subregionId: Scalars['Float']['output'];
  subregionName: Scalars['String']['output'];
  tld: Scalars['String']['output'];
};

export type CountryConnection = {
  __typename?: 'CountryConnection';
  edges: Array<CountryEdge>;
  pageInfo: PageInfo;
};

export type CountryEdge = {
  __typename?: 'CountryEdge';
  /** Used in `before` and `after` args */
  cursor: Scalars['String']['output'];
  node: Country;
};

export type CreatePasswordInput = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type DeleteFormDataInput = {
  alternateFormId: Scalars['String']['input'];
};

export type Document = {
  __typename?: 'Document';
  formAlternateId: Scalars['String']['output'];
  formId: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isPdf: Scalars['Boolean']['output'];
  lastModifiedBy: Scalars['String']['output'];
  recordedBy: Scalars['String']['output'];
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type DocumentConnection = {
  __typename?: 'DocumentConnection';
  edges: Array<DocumentEdge>;
  pageInfo: PageInfo;
};

export type DocumentEdge = {
  __typename?: 'DocumentEdge';
  /** Used in `before` and `after` args */
  cursor: Scalars['String']['output'];
  node: Document;
};

export type DocumentInput = {
  alternateId: Scalars['String']['input'];
  formId: Scalars['Float']['input'];
  type: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type Education = {
  __typename?: 'Education';
  activitiesAndSocities?: Maybe<Scalars['String']['output']>;
  college: Scalars['String']['output'];
  degree: Scalars['String']['output'];
  endDate: Scalars['DateTimeISO']['output'];
  fieldOfStudy: Scalars['String']['output'];
  grade?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  profileId: Scalars['Float']['output'];
  recordedBy: Scalars['String']['output'];
  startDate: Scalars['DateTimeISO']['output'];
};

export type EducationConnection = {
  __typename?: 'EducationConnection';
  edges: Array<EducationEdge>;
  pageInfo: PageInfo;
};

export type EducationEdge = {
  __typename?: 'EducationEdge';
  /** Used in `before` and `after` args */
  cursor: Scalars['String']['output'];
  node: Education;
};

export type FormData = {
  __typename?: 'FormData';
  alternateFormId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  formLinkDesc?: Maybe<Scalars['String']['output']>;
  formLinkName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isDeleted?: Maybe<Scalars['Boolean']['output']>;
  isPublished?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy: Scalars['String']['output'];
  recordedBy: Scalars['String']['output'];
  submissions?: Maybe<Array<Submission>>;
  templateRow?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  user: User;
  userId: Scalars['String']['output'];
};

export type FormDataConnection = {
  __typename?: 'FormDataConnection';
  edges: Array<FormDataEdge>;
  pageInfo: PageInfo;
};

export type FormDataEdge = {
  __typename?: 'FormDataEdge';
  /** Used in `before` and `after` args */
  cursor: Scalars['String']['output'];
  node: FormData;
};

export type FormDataInput = {
  alternateFormId: Scalars['String']['input'];
  templateRow: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type LinkNameFormData = {
  alternateFormId: Scalars['String']['input'];
  formLinkDesc: Scalars['String']['input'];
  formLinkName: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addFormData: FormData;
  addFormSubmission: Submission;
  addLinkNameData: FormData;
  changePassword: User;
  createPassword: User;
  deleteFormData: FormData;
  publishFormData: FormData;
  registerCompanyAdmin: User;
  registerUser: User;
  removeAchievementAwardById: AchievementAward;
  removeAssetByAchievementAwardById: Asset;
  removeAssetByWorkExperienceById: Asset;
  removeEducationAndQualification: Education;
  removeFormDocument: Document;
  removeWorkExperienceById: WorkExperience;
  removecandidateSkill: CandidateSkill;
  resetPassword: Scalars['Boolean']['output'];
  saveAchievementAward: AchievementAward;
  saveAdditonalInfo: AdditionalInfo;
  saveCandidateSkill: CandidateSkill;
  saveEducationAndQualification: Education;
  savePersonalInformation: Profile;
  saveQuestionaireAnswer: Array<QuestionaireAnswer>;
  saveWorkExperience: WorkExperience;
  sendForgetPassLink: Scalars['Boolean']['output'];
  updateAchievementAwardById: AchievementAward;
  updateCandidateSkillById: CandidateSkill;
  updateEducationById: Education;
  updateFormData: FormData;
  updateFormDocument: Array<Document>;
  updateWorkExperienceById: WorkExperience;
};


export type MutationAddFormDataArgs = {
  input: FormDataInput;
};


export type MutationAddFormSubmissionArgs = {
  input: SubmissionInput;
};


export type MutationAddLinkNameDataArgs = {
  input: LinkNameFormData;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationCreatePasswordArgs = {
  input: CreatePasswordInput;
};


export type MutationDeleteFormDataArgs = {
  input: DeleteFormDataInput;
};


export type MutationPublishFormDataArgs = {
  input: PulishFormDataInput;
};


export type MutationRegisterCompanyAdminArgs = {
  input: CompanyAdminInput;
};


export type MutationRegisterUserArgs = {
  input: UserInput;
};


export type MutationRemoveAchievementAwardByIdArgs = {
  achievementAwardId: Scalars['Float']['input'];
};


export type MutationRemoveAssetByAchievementAwardByIdArgs = {
  achievementAwardId: Scalars['Float']['input'];
};


export type MutationRemoveAssetByWorkExperienceByIdArgs = {
  workExperienceId: Scalars['Float']['input'];
};


export type MutationRemoveEducationAndQualificationArgs = {
  educationId: Scalars['Float']['input'];
};


export type MutationRemoveFormDocumentArgs = {
  documentId: Scalars['Float']['input'];
};


export type MutationRemoveWorkExperienceByIdArgs = {
  workExperienceId: Scalars['Float']['input'];
};


export type MutationRemovecandidateSkillArgs = {
  candidateSkillId: Scalars['Float']['input'];
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationSaveAchievementAwardArgs = {
  input: SaveAchievementAwardInput;
};


export type MutationSaveAdditonalInfoArgs = {
  input: SaveAdditionalInfoInput;
};


export type MutationSaveCandidateSkillArgs = {
  input: SaveCandidateSkillsInput;
};


export type MutationSaveEducationAndQualificationArgs = {
  input: SaveEducationInput;
};


export type MutationSavePersonalInformationArgs = {
  input: SavePersonalInfoInput;
};


export type MutationSaveQuestionaireAnswerArgs = {
  questions: Array<SaveQuestionaireAnsInput>;
};


export type MutationSaveWorkExperienceArgs = {
  input: SaveWorkExperienceInput;
};


export type MutationSendForgetPassLinkArgs = {
  email: Scalars['String']['input'];
};


export type MutationUpdateAchievementAwardByIdArgs = {
  achievementAwardId: Scalars['Float']['input'];
  input: SaveAchievementAwardInput;
};


export type MutationUpdateCandidateSkillByIdArgs = {
  candidateSkillId: Scalars['Float']['input'];
  input: SaveCandidateSkillsInput;
};


export type MutationUpdateEducationByIdArgs = {
  educationId: Scalars['Float']['input'];
  input: SaveEducationInput;
};


export type MutationUpdateFormDataArgs = {
  input: UpdateFormDataInput;
};


export type MutationUpdateFormDocumentArgs = {
  input: Array<DocumentInput>;
};


export type MutationUpdateWorkExperienceByIdArgs = {
  input: SaveWorkExperienceInput;
  workExperienceId: Scalars['Float']['input'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type Profile = {
  __typename?: 'Profile';
  additionalInfo?: Maybe<AdditionalInfo>;
  addressLineOne: Scalars['String']['output'];
  addressLineTwo: Scalars['String']['output'];
  alternateEmail?: Maybe<Scalars['String']['output']>;
  alternatePhone?: Maybe<Scalars['String']['output']>;
  batchId: Scalars['String']['output'];
  candidateSkills?: Maybe<Array<CandidateSkill>>;
  careOfContact?: Maybe<Scalars['String']['output']>;
  careOfName?: Maybe<Scalars['String']['output']>;
  careOfType?: Maybe<Scalars['String']['output']>;
  city?: Maybe<City>;
  cityId: Scalars['Float']['output'];
  collegeId: Scalars['String']['output'];
  country?: Maybe<Country>;
  countryId: Scalars['Float']['output'];
  courseId: Scalars['String']['output'];
  currentAddressLineOne: Scalars['String']['output'];
  currentAddressLineTwo: Scalars['String']['output'];
  currentCity?: Maybe<City>;
  currentCityId: Scalars['Float']['output'];
  currentCountry?: Maybe<Country>;
  currentCountryId: Scalars['Float']['output'];
  currentState?: Maybe<State>;
  currentStateId: Scalars['Float']['output'];
  currentZipCode: Scalars['String']['output'];
  dob: Scalars['DateTimeISO']['output'];
  educations?: Maybe<Array<Education>>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  gender: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastModifiedBy: Scalars['String']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  phone: Scalars['String']['output'];
  profileType: Scalars['String']['output'];
  questionaireAnswer?: Maybe<Array<QuestionaireAnswer>>;
  recordedBy: Scalars['String']['output'];
  state?: Maybe<State>;
  stateId: Scalars['Float']['output'];
  userId: Scalars['String']['output'];
  workExperience?: Maybe<Array<WorkExperience>>;
  zipCode: Scalars['String']['output'];
};

export type ProfileConnection = {
  __typename?: 'ProfileConnection';
  edges: Array<ProfileEdge>;
  pageInfo: PageInfo;
};

export type ProfileEdge = {
  __typename?: 'ProfileEdge';
  /** Used in `before` and `after` args */
  cursor: Scalars['String']['output'];
  node: Profile;
};

export type PulishFormDataInput = {
  alternateFormId: Scalars['String']['input'];
  formLinkName: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  achievementAwards: AchievementAwardConnection;
  addionalInfo: AdditionalInfo;
  additionalInfoById: AdditionalInfo;
  candidateSkills: CandidateSkillConnection;
  cities: CityConnection;
  countries: CountryConnection;
  educations: EducationConnection;
  formDataByFormId: FormData;
  formDataByFormLinkName: FormData;
  formDataByUserId: FormDataConnection;
  getAllFormData: FormDataConnection;
  getAwardById: AchievementAward;
  getEducationById: Education;
  getEducationByProfileId: EducationConnection;
  getFileByFormId: Array<Document>;
  getFilesByFormId: DocumentConnection;
  getFormSubmission: SubmissionConnection;
  getFormSubmissionByFormId: SubmissionConnection;
  getTemplateByFormId: FormData;
  getWorkExperienceById: WorkExperience;
  getcandidateSkillById: CandidateSkill;
  myAssets: AssetConnection;
  myFormData: FormDataConnection;
  myPersonalInfo: Profile;
  myWorkExperience: WorkExperienceConnection;
  profileById: Profile;
  profiles: ProfileConnection;
  questionaireAns: QuestionaireAnswerConnection;
  questions: QuestionConnection;
  states: StateConnection;
  upload_getSignedUrl: Scalars['String']['output'];
  userById: User;
  users: UserConnection;
  viewer: Viewer;
};


export type QueryAchievementAwardsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryAdditionalInfoByIdArgs = {
  addId: Scalars['Float']['input'];
};


export type QueryCandidateSkillsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryCitiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
  stateId?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryCountriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryEducationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryFormDataByFormIdArgs = {
  formId: Scalars['String']['input'];
  isDeleted?: Scalars['Boolean']['input'];
};


export type QueryFormDataByFormLinkNameArgs = {
  formLinkName: Scalars['String']['input'];
  isDeleted?: Scalars['Boolean']['input'];
};


export type QueryFormDataByUserIdArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  isDeleted?: Scalars['Boolean']['input'];
  last?: InputMaybe<Scalars['Float']['input']>;
  userId: Scalars['String']['input'];
};


export type QueryGetAllFormDataArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryGetAwardByIdArgs = {
  awardId: Scalars['Float']['input'];
};


export type QueryGetEducationByIdArgs = {
  educationId: Scalars['Float']['input'];
};


export type QueryGetEducationByProfileIdArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
  profileId: Scalars['Float']['input'];
};


export type QueryGetFileByFormIdArgs = {
  formId: Scalars['String']['input'];
};


export type QueryGetFilesByFormIdArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  formId: Scalars['String']['input'];
  last?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryGetFormSubmissionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryGetFormSubmissionByFormIdArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  formId: Scalars['Float']['input'];
  last?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryGetTemplateByFormIdArgs = {
  formId: Scalars['String']['input'];
};


export type QueryGetWorkExperienceByIdArgs = {
  workExperienceId: Scalars['Float']['input'];
};


export type QueryGetcandidateSkillByIdArgs = {
  candidateSkillId: Scalars['Float']['input'];
};


export type QueryMyAssetsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryMyFormDataArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryMyWorkExperienceArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryProfileByIdArgs = {
  profileId: Scalars['String']['input'];
};


export type QueryProfilesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryQuestionaireAnsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryQuestionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryStatesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  countryId?: InputMaybe<Scalars['Float']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryUpload_GetSignedUrlArgs = {
  input: UploadInput;
};


export type QueryUserByIdArgs = {
  userId: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
};

export type Question = {
  __typename?: 'Question';
  id: Scalars['ID']['output'];
  lastModifiedBy: Scalars['String']['output'];
  recordedBy: Scalars['String']['output'];
  text?: Maybe<Scalars['String']['output']>;
};

export type QuestionConnection = {
  __typename?: 'QuestionConnection';
  edges: Array<QuestionEdge>;
  pageInfo: PageInfo;
};

export type QuestionEdge = {
  __typename?: 'QuestionEdge';
  /** Used in `before` and `after` args */
  cursor: Scalars['String']['output'];
  node: Question;
};

export type QuestionaireAnswer = {
  __typename?: 'QuestionaireAnswer';
  answer: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastModifiedBy: Scalars['String']['output'];
  profileId?: Maybe<Scalars['Float']['output']>;
  question?: Maybe<Question>;
  questionId: Scalars['Float']['output'];
  recordedBy: Scalars['String']['output'];
};

export type QuestionaireAnswerConnection = {
  __typename?: 'QuestionaireAnswerConnection';
  edges: Array<QuestionaireAnswerEdge>;
  pageInfo: PageInfo;
};

export type QuestionaireAnswerEdge = {
  __typename?: 'QuestionaireAnswerEdge';
  /** Used in `before` and `after` args */
  cursor: Scalars['String']['output'];
  node: QuestionaireAnswer;
};

export type ResetPasswordInput = {
  code: Scalars['String']['input'];
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type SaveAchievementAwardInput = {
  assets?: InputMaybe<Array<AssetInput>>;
  associatedWith?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  issuer?: InputMaybe<Scalars['String']['input']>;
  issuerDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  title: Scalars['String']['input'];
};

export type SaveAdditionalInfoInput = {
  coveringLetter?: InputMaybe<Scalars['String']['input']>;
  statementOfPurpose?: InputMaybe<Scalars['String']['input']>;
};

export type SaveCandidateSkillsInput = {
  name: Scalars['String']['input'];
};

export type SaveEducationInput = {
  activitiesAndSocities?: InputMaybe<Scalars['String']['input']>;
  college: Scalars['String']['input'];
  degree: Scalars['String']['input'];
  endDate: Scalars['DateTimeISO']['input'];
  fieldOfStudy: Scalars['String']['input'];
  grade: Scalars['String']['input'];
  percentage?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['DateTimeISO']['input'];
};

export type SavePersonalInfoInput = {
  addressLineOne?: InputMaybe<Scalars['String']['input']>;
  addressLineTwo?: InputMaybe<Scalars['String']['input']>;
  alternateEmail?: InputMaybe<Scalars['String']['input']>;
  alternatePhone?: InputMaybe<Scalars['String']['input']>;
  careOfContact: Scalars['String']['input'];
  careOfName?: InputMaybe<Scalars['String']['input']>;
  careOfType: Scalars['String']['input'];
  cityId?: InputMaybe<Scalars['Float']['input']>;
  countryId?: InputMaybe<Scalars['Float']['input']>;
  currentAddressLineOne?: InputMaybe<Scalars['String']['input']>;
  currentAddressLineTwo?: InputMaybe<Scalars['String']['input']>;
  currentCityId?: InputMaybe<Scalars['Float']['input']>;
  currentCountryId?: InputMaybe<Scalars['Float']['input']>;
  currentStateId?: InputMaybe<Scalars['Float']['input']>;
  currentZipCode?: InputMaybe<Scalars['String']['input']>;
  dob: Scalars['DateTimeISO']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  gender: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  stateId?: InputMaybe<Scalars['Float']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type SaveQuestionaireAnsInput = {
  answer?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Float']['input']>;
  questionId: Scalars['Float']['input'];
};

export type SaveWorkExperienceInput = {
  assets?: InputMaybe<Array<AssetInput>>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  employmentType?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  locationType?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  title: Scalars['String']['input'];
};

export type State = {
  __typename?: 'State';
  countryId: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  lastModifiedBy: Scalars['String']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  recordedBy: Scalars['String']['output'];
  stateCode: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

export type StateConnection = {
  __typename?: 'StateConnection';
  edges: Array<StateEdge>;
  pageInfo: PageInfo;
};

export type StateEdge = {
  __typename?: 'StateEdge';
  /** Used in `before` and `after` args */
  cursor: Scalars['String']['output'];
  node: State;
};

export type Submission = {
  __typename?: 'Submission';
  formAlternateId: Scalars['String']['output'];
  formId: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  jsonData: Scalars['String']['output'];
  lastModifiedBy: Scalars['String']['output'];
  recordedBy: Scalars['String']['output'];
};

export type SubmissionConnection = {
  __typename?: 'SubmissionConnection';
  edges: Array<SubmissionEdge>;
  pageInfo: PageInfo;
};

export type SubmissionEdge = {
  __typename?: 'SubmissionEdge';
  /** Used in `before` and `after` args */
  cursor: Scalars['String']['output'];
  node: Submission;
};

export type SubmissionInput = {
  formAlternateId: Scalars['String']['input'];
  formId: Scalars['Float']['input'];
  jsonData: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type UpdateFormDataInput = {
  alternateFormId: Scalars['String']['input'];
  templateRow: Scalars['String']['input'];
};

export type UploadInput = {
  mimeType: Scalars['String']['input'];
  name: Scalars['String']['input'];
  path: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  accessType: Scalars['String']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['DateTimeISO']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  lastModifiedBy: Scalars['String']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  organisationName?: Maybe<Scalars['String']['output']>;
  phone: Scalars['String']['output'];
  profile?: Maybe<Profile>;
  recordedBy: Scalars['String']['output'];
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  /** Used in `before` and `after` args */
  cursor: Scalars['String']['output'];
  node: User;
};

export type UserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type Viewer = {
  __typename?: 'Viewer';
  expires?: Maybe<Scalars['DateTimeISO']['output']>;
  user?: Maybe<User>;
};

export type WorkExperience = {
  __typename?: 'WorkExperience';
  assets?: Maybe<Array<Asset>>;
  companyName: Scalars['String']['output'];
  description: Scalars['String']['output'];
  employmentType: Scalars['String']['output'];
  endDate: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  location: Scalars['String']['output'];
  locationType: Scalars['String']['output'];
  profileId: Scalars['Float']['output'];
  startDate: Scalars['DateTimeISO']['output'];
  title: Scalars['String']['output'];
};

export type WorkExperienceConnection = {
  __typename?: 'WorkExperienceConnection';
  edges: Array<WorkExperienceEdge>;
  pageInfo: PageInfo;
};

export type WorkExperienceEdge = {
  __typename?: 'WorkExperienceEdge';
  /** Used in `before` and `after` args */
  cursor: Scalars['String']['output'];
  node: WorkExperience;
};

export type PageInfoFragmentFragment = { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null };

export type AchievementAwardFragment = { __typename?: 'AchievementAward', id: string, title: string, profileId: number, associatedWith: string, issuer: string, issuerDate: any, description: string, isDeleted?: boolean | null };

export type RemoveAchievementAwardByIdMutationVariables = Exact<{
  achievementAwardId: Scalars['Float']['input'];
}>;


export type RemoveAchievementAwardByIdMutation = { __typename?: 'Mutation', removeAchievementAwardById: { __typename?: 'AchievementAward', id: string, title: string, profileId: number, associatedWith: string, issuer: string, issuerDate: any, description: string, isDeleted?: boolean | null, assets?: Array<{ __typename?: 'Asset', id: string, name?: string | null, url?: string | null, fileType?: string | null, type: string, desc: string, isDeleted: boolean }> | null } };

export type SaveAchievementAwardMutationVariables = Exact<{
  input: SaveAchievementAwardInput;
}>;


export type SaveAchievementAwardMutation = { __typename?: 'Mutation', saveAchievementAward: { __typename?: 'AchievementAward', id: string, title: string, profileId: number, associatedWith: string, issuer: string, issuerDate: any, description: string, isDeleted?: boolean | null, assets?: Array<{ __typename?: 'Asset', id: string, name?: string | null, url?: string | null, fileType?: string | null, type: string, desc: string, isDeleted: boolean }> | null } };

export type UpdateAchievementAwardByIdMutationVariables = Exact<{
  input: SaveAchievementAwardInput;
  achievementAwardId: Scalars['Float']['input'];
}>;


export type UpdateAchievementAwardByIdMutation = { __typename?: 'Mutation', updateAchievementAwardById: { __typename?: 'AchievementAward', id: string, title: string, profileId: number, associatedWith: string, issuer: string, issuerDate: any, description: string, isDeleted?: boolean | null, assets?: Array<{ __typename?: 'Asset', id: string, name?: string | null, url?: string | null, fileType?: string | null, type: string, desc: string, isDeleted: boolean }> | null } };

export type AchievementAwardsQueryVariables = Exact<{
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
}>;


export type AchievementAwardsQuery = { __typename?: 'Query', achievementAwards: { __typename?: 'AchievementAwardConnection', edges: Array<{ __typename?: 'AchievementAwardEdge', cursor: string, node: { __typename?: 'AchievementAward', id: string, title: string, profileId: number, associatedWith: string, issuer: string, issuerDate: any, description: string, isDeleted?: boolean | null, assets?: Array<{ __typename?: 'Asset', id: string, name?: string | null, url?: string | null, fileType?: string | null, type: string, desc: string, isDeleted: boolean }> | null } }> } };

export type GetAwardByIdQueryVariables = Exact<{
  awardId: Scalars['Float']['input'];
}>;


export type GetAwardByIdQuery = { __typename?: 'Query', getAwardById: { __typename?: 'AchievementAward', id: string, title: string, profileId: number, associatedWith: string, issuer: string, issuerDate: any, description: string, isDeleted?: boolean | null, assets?: Array<{ __typename?: 'Asset', id: string, name?: string | null, url?: string | null, fileType?: string | null, type: string, desc: string, isDeleted: boolean }> | null } };

export type AdditionalInfoFragment = { __typename?: 'AdditionalInfo', id: string, profileId: number, coveringLetter?: string | null, statementOfPurpose?: string | null };

export type SaveAdditonalInfoMutationVariables = Exact<{
  input: SaveAdditionalInfoInput;
}>;


export type SaveAdditonalInfoMutation = { __typename?: 'Mutation', saveAdditonalInfo: { __typename?: 'AdditionalInfo', id: string, profileId: number, coveringLetter?: string | null, statementOfPurpose?: string | null } };

export type AddionalInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type AddionalInfoQuery = { __typename?: 'Query', addionalInfo: { __typename?: 'AdditionalInfo', id: string, profileId: number, coveringLetter?: string | null, statementOfPurpose?: string | null } };

export type AssetFragment = { __typename?: 'Asset', id: string, name?: string | null, url?: string | null, fileType?: string | null, type: string, desc: string, isDeleted: boolean };

export type RemoveAssetByAchievementAwardByIdMutationVariables = Exact<{
  achievementAwardId: Scalars['Float']['input'];
}>;


export type RemoveAssetByAchievementAwardByIdMutation = { __typename?: 'Mutation', removeAssetByAchievementAwardById: { __typename?: 'Asset', id: string, name?: string | null, url?: string | null, fileType?: string | null, type: string, desc: string, isDeleted: boolean } };

export type RemoveAssetByWorkExperienceByIdMutationVariables = Exact<{
  workExperienceId: Scalars['Float']['input'];
}>;


export type RemoveAssetByWorkExperienceByIdMutation = { __typename?: 'Mutation', removeAssetByWorkExperienceById: { __typename?: 'Asset', id: string, name?: string | null, url?: string | null, fileType?: string | null, type: string, desc: string, isDeleted: boolean } };

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'User', id: string, name?: string | null, firstName?: string | null, lastName?: string | null, email: string, organisationName?: string | null, accessType: string } };

export type CreatePasswordMutationVariables = Exact<{
  input: CreatePasswordInput;
}>;


export type CreatePasswordMutation = { __typename?: 'Mutation', createPassword: { __typename?: 'User', id: string, name?: string | null, firstName?: string | null, lastName?: string | null, email: string, organisationName?: string | null, accessType: string } };

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: boolean };

export type SendForgetPassLinkMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type SendForgetPassLinkMutation = { __typename?: 'Mutation', sendForgetPassLink: boolean };

export type CandidateSkillFragment = { __typename?: 'CandidateSkill', id: string, name: string, profileId: number, workExperience?: string | null, internship?: string | null, isDeleted?: boolean | null, recordedBy?: string | null, lastModifiedBy?: string | null };

export type RemoveCandidateSkillMutationVariables = Exact<{
  candidateSkillId: Scalars['Float']['input'];
}>;


export type RemoveCandidateSkillMutation = { __typename?: 'Mutation', removecandidateSkill: { __typename?: 'CandidateSkill', id: string, name: string, profileId: number, workExperience?: string | null, internship?: string | null, isDeleted?: boolean | null, recordedBy?: string | null, lastModifiedBy?: string | null } };

export type SaveCandidateSkillMutationVariables = Exact<{
  input: SaveCandidateSkillsInput;
}>;


export type SaveCandidateSkillMutation = { __typename?: 'Mutation', saveCandidateSkill: { __typename?: 'CandidateSkill', id: string, name: string, profileId: number, workExperience?: string | null, internship?: string | null, isDeleted?: boolean | null, recordedBy?: string | null, lastModifiedBy?: string | null } };

export type UpdateCandidateSkillByIdMutationVariables = Exact<{
  input: SaveCandidateSkillsInput;
  candidateSkillId: Scalars['Float']['input'];
}>;


export type UpdateCandidateSkillByIdMutation = { __typename?: 'Mutation', updateCandidateSkillById: { __typename?: 'CandidateSkill', id: string, name: string, profileId: number, workExperience?: string | null, internship?: string | null, isDeleted?: boolean | null, recordedBy?: string | null, lastModifiedBy?: string | null } };

export type CandidateSkillsQueryVariables = Exact<{
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
}>;


export type CandidateSkillsQuery = { __typename?: 'Query', candidateSkills: { __typename?: 'CandidateSkillConnection', edges: Array<{ __typename?: 'CandidateSkillEdge', cursor: string, node: { __typename?: 'CandidateSkill', id: string, name: string, profileId: number, workExperience?: string | null, internship?: string | null, isDeleted?: boolean | null, recordedBy?: string | null, lastModifiedBy?: string | null } }> } };

export type GetcandidateSkillByIdQueryVariables = Exact<{
  candidateSkillId: Scalars['Float']['input'];
}>;


export type GetcandidateSkillByIdQuery = { __typename?: 'Query', getcandidateSkillById: { __typename?: 'CandidateSkill', id: string, name: string, profileId: number, workExperience?: string | null, internship?: string | null, isDeleted?: boolean | null, recordedBy?: string | null, lastModifiedBy?: string | null } };

export type CityFragmentFragment = { __typename?: 'City', id: string, stateId: number, name: string, wikiDataId?: string | null, latitude?: number | null, longitude?: number | null };

export type CitiesQueryVariables = Exact<{
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
  stateId?: InputMaybe<Scalars['Float']['input']>;
}>;


export type CitiesQuery = { __typename?: 'Query', cities: { __typename?: 'CityConnection', edges: Array<{ __typename?: 'CityEdge', cursor: string, node: { __typename?: 'City', id: string, stateId: number, name: string, wikiDataId?: string | null, latitude?: number | null, longitude?: number | null } }> } };

export type CountriesFragmentFragment = { __typename?: 'Country', id: string, capital: string, currency: string, currencyName: string, currencySymbol: string, emoji: string, emojiU: string, iso2: string, iso3: string, latitude: number, longitude: number, name: string, nationality: string, numericCode: string, phoneCode: string, regionName: string, subregionName: string };

export type CountriesQueryVariables = Exact<{
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
}>;


export type CountriesQuery = { __typename?: 'Query', countries: { __typename?: 'CountryConnection', edges: Array<{ __typename?: 'CountryEdge', node: { __typename?: 'Country', id: string, capital: string, currency: string, currencyName: string, currencySymbol: string, emoji: string, emojiU: string, iso2: string, iso3: string, latitude: number, longitude: number, name: string, nationality: string, numericCode: string, phoneCode: string, regionName: string, subregionName: string } }> } };

export type EducationFragmentFragment = { __typename?: 'Education', id: string, profileId: number, startDate: any, endDate: any, fieldOfStudy: string, degree: string, college: string, grade?: string | null, activitiesAndSocities?: string | null, isDeleted: boolean };

export type RemoveEducationAndQualificationMutationVariables = Exact<{
  educationId: Scalars['Float']['input'];
}>;


export type RemoveEducationAndQualificationMutation = { __typename?: 'Mutation', removeEducationAndQualification: { __typename?: 'Education', id: string, profileId: number, startDate: any, endDate: any, fieldOfStudy: string, degree: string, college: string, grade?: string | null, activitiesAndSocities?: string | null, isDeleted: boolean } };

export type SaveEducationAndQualificationMutationVariables = Exact<{
  input: SaveEducationInput;
}>;


export type SaveEducationAndQualificationMutation = { __typename?: 'Mutation', saveEducationAndQualification: { __typename?: 'Education', id: string, profileId: number, startDate: any, endDate: any, fieldOfStudy: string, degree: string, college: string, grade?: string | null, activitiesAndSocities?: string | null, isDeleted: boolean } };

export type UpdateEducationByIdMutationVariables = Exact<{
  input: SaveEducationInput;
  educationId: Scalars['Float']['input'];
}>;


export type UpdateEducationByIdMutation = { __typename?: 'Mutation', updateEducationById: { __typename?: 'Education', id: string, profileId: number, startDate: any, endDate: any, fieldOfStudy: string, degree: string, college: string, grade?: string | null, activitiesAndSocities?: string | null, isDeleted: boolean } };

export type GetEducationByIdQueryVariables = Exact<{
  educationId: Scalars['Float']['input'];
}>;


export type GetEducationByIdQuery = { __typename?: 'Query', getEducationById: { __typename?: 'Education', id: string, profileId: number, startDate: any, endDate: any, fieldOfStudy: string, degree: string, college: string, grade?: string | null, activitiesAndSocities?: string | null, isDeleted: boolean } };

export type EducationsQueryVariables = Exact<{
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
}>;


export type EducationsQuery = { __typename?: 'Query', educations: { __typename?: 'EducationConnection', edges: Array<{ __typename?: 'EducationEdge', cursor: string, node: { __typename?: 'Education', id: string, profileId: number, startDate: any, endDate: any, fieldOfStudy: string, degree: string, college: string, grade?: string | null, activitiesAndSocities?: string | null, isDeleted: boolean } }> } };

export type FormDataFragmentFragment = { __typename?: 'FormData', id: string, userId: string, alternateFormId?: string | null, templateRow?: string | null, isPublished?: boolean | null, isDeleted?: boolean | null, createdAt: any, formLinkName?: string | null, formLinkDesc?: string | null };

export type AddFormDataMutationVariables = Exact<{
  input: FormDataInput;
}>;


export type AddFormDataMutation = { __typename?: 'Mutation', addFormData: { __typename?: 'FormData', id: string, userId: string, alternateFormId?: string | null, templateRow?: string | null, isPublished?: boolean | null, isDeleted?: boolean | null, createdAt: any, formLinkName?: string | null, formLinkDesc?: string | null } };

export type AddLinkNameDataMutationVariables = Exact<{
  input: LinkNameFormData;
}>;


export type AddLinkNameDataMutation = { __typename?: 'Mutation', addLinkNameData: { __typename?: 'FormData', id: string, userId: string, alternateFormId?: string | null, templateRow?: string | null, isPublished?: boolean | null, isDeleted?: boolean | null, createdAt: any, formLinkName?: string | null, formLinkDesc?: string | null } };

export type DeleteFormDataMutationVariables = Exact<{
  input: DeleteFormDataInput;
}>;


export type DeleteFormDataMutation = { __typename?: 'Mutation', deleteFormData: { __typename?: 'FormData', id: string, userId: string, alternateFormId?: string | null, templateRow?: string | null, isPublished?: boolean | null, isDeleted?: boolean | null, createdAt: any, formLinkName?: string | null, formLinkDesc?: string | null } };

export type PublishFormDataMutationVariables = Exact<{
  input: PulishFormDataInput;
}>;


export type PublishFormDataMutation = { __typename?: 'Mutation', publishFormData: { __typename?: 'FormData', id: string, userId: string, alternateFormId?: string | null, templateRow?: string | null, isPublished?: boolean | null, isDeleted?: boolean | null, createdAt: any, formLinkName?: string | null, formLinkDesc?: string | null } };

export type UpdateFormDataMutationVariables = Exact<{
  input: UpdateFormDataInput;
}>;


export type UpdateFormDataMutation = { __typename?: 'Mutation', updateFormData: { __typename?: 'FormData', id: string, userId: string, alternateFormId?: string | null, templateRow?: string | null, isPublished?: boolean | null, isDeleted?: boolean | null, createdAt: any, formLinkName?: string | null, formLinkDesc?: string | null } };

export type FormDataByFormIdQueryVariables = Exact<{
  formId: Scalars['String']['input'];
}>;


export type FormDataByFormIdQuery = { __typename?: 'Query', formDataByFormId: { __typename?: 'FormData', id: string, userId: string, alternateFormId?: string | null, templateRow?: string | null, isPublished?: boolean | null, isDeleted?: boolean | null, createdAt: any, formLinkName?: string | null, formLinkDesc?: string | null } };

export type FormDataByFormLinkNameQueryVariables = Exact<{
  formLinkName: Scalars['String']['input'];
}>;


export type FormDataByFormLinkNameQuery = { __typename?: 'Query', formDataByFormLinkName: { __typename?: 'FormData', id: string, userId: string, alternateFormId?: string | null, templateRow?: string | null, isPublished?: boolean | null, isDeleted?: boolean | null, createdAt: any, formLinkName?: string | null, formLinkDesc?: string | null } };

export type FormDataByUserIdQueryVariables = Exact<{
  userId: Scalars['String']['input'];
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
}>;


export type FormDataByUserIdQuery = { __typename?: 'Query', formDataByUserId: { __typename?: 'FormDataConnection', edges: Array<{ __typename?: 'FormDataEdge', cursor: string, node: { __typename?: 'FormData', id: string, userId: string, alternateFormId?: string | null, templateRow?: string | null, isPublished?: boolean | null, isDeleted?: boolean | null, createdAt: any, formLinkName?: string | null, formLinkDesc?: string | null } }> } };

export type GetAllFormDataQueryVariables = Exact<{
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GetAllFormDataQuery = { __typename?: 'Query', getAllFormData: { __typename?: 'FormDataConnection', edges: Array<{ __typename?: 'FormDataEdge', cursor: string, node: { __typename?: 'FormData', id: string, userId: string, alternateFormId?: string | null, templateRow?: string | null, isPublished?: boolean | null, isDeleted?: boolean | null, createdAt: any, formLinkName?: string | null, formLinkDesc?: string | null, submissions?: Array<{ __typename?: 'Submission', id: string, formId: number, jsonData: string, formAlternateId: string }> | null, user: { __typename?: 'User', id: string, name?: string | null, firstName?: string | null, lastName?: string | null, email: string, organisationName?: string | null, accessType: string } } }> } };

export type GetTemplateByFormIdQueryVariables = Exact<{
  formId: Scalars['String']['input'];
}>;


export type GetTemplateByFormIdQuery = { __typename?: 'Query', getTemplateByFormId: { __typename?: 'FormData', id: string, userId: string, alternateFormId?: string | null, templateRow?: string | null, isPublished?: boolean | null, isDeleted?: boolean | null, createdAt: any, formLinkName?: string | null, formLinkDesc?: string | null } };

export type MyFormDataQueryVariables = Exact<{
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
}>;


export type MyFormDataQuery = { __typename?: 'Query', myFormData: { __typename?: 'FormDataConnection', edges: Array<{ __typename?: 'FormDataEdge', cursor: string, node: { __typename?: 'FormData', id: string, userId: string, alternateFormId?: string | null, templateRow?: string | null, isPublished?: boolean | null, isDeleted?: boolean | null, createdAt: any, formLinkName?: string | null, formLinkDesc?: string | null } }> } };

export type DocumentFragmentFragment = { __typename?: 'Document', id: string, formId: number, formAlternateId: string, url: string, isPdf: boolean, type: string, isDeleted: boolean };

export type RemoveFormDocumentMutationVariables = Exact<{
  documentId: Scalars['Float']['input'];
}>;


export type RemoveFormDocumentMutation = { __typename?: 'Mutation', removeFormDocument: { __typename?: 'Document', id: string, formId: number, formAlternateId: string, url: string, isPdf: boolean, type: string, isDeleted: boolean } };

export type UpdateFormDocumentMutationVariables = Exact<{
  input: Array<DocumentInput> | DocumentInput;
}>;


export type UpdateFormDocumentMutation = { __typename?: 'Mutation', updateFormDocument: Array<{ __typename?: 'Document', id: string, formId: number, formAlternateId: string, url: string, isPdf: boolean, type: string, isDeleted: boolean }> };

export type GetFileByFormIdQueryVariables = Exact<{
  formId: Scalars['String']['input'];
}>;


export type GetFileByFormIdQuery = { __typename?: 'Query', getFileByFormId: Array<{ __typename?: 'Document', id: string, formId: number, formAlternateId: string, url: string, isPdf: boolean, type: string, isDeleted: boolean }> };

export type GetFilesByFormIdQueryVariables = Exact<{
  formId: Scalars['String']['input'];
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GetFilesByFormIdQuery = { __typename?: 'Query', getFilesByFormId: { __typename?: 'DocumentConnection', edges: Array<{ __typename?: 'DocumentEdge', cursor: string, node: { __typename?: 'Document', id: string, formId: number, formAlternateId: string, url: string, isPdf: boolean, type: string, isDeleted: boolean } }> } };

export type ProfileFragmentFragment = { __typename?: 'Profile', id: string, userId: string, firstName?: string | null, lastName?: string | null, dob: any, gender: string, phone: string, alternatePhone?: string | null, email?: string | null, alternateEmail?: string | null, profileType: string, currentAddressLineOne: string, currentAddressLineTwo: string, currentZipCode: string, addressLineOne: string, addressLineTwo: string, zipCode: string, careOfName?: string | null, careOfContact?: string | null, careOfType?: string | null };

export type SavePersonalInformationMutationVariables = Exact<{
  input: SavePersonalInfoInput;
}>;


export type SavePersonalInformationMutation = { __typename?: 'Mutation', savePersonalInformation: { __typename?: 'Profile', id: string, userId: string, firstName?: string | null, lastName?: string | null, dob: any, gender: string, phone: string, alternatePhone?: string | null, email?: string | null, alternateEmail?: string | null, profileType: string, currentAddressLineOne: string, currentAddressLineTwo: string, currentZipCode: string, addressLineOne: string, addressLineTwo: string, zipCode: string, careOfName?: string | null, careOfContact?: string | null, careOfType?: string | null } };

export type MyPersonalInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPersonalInfoQuery = { __typename?: 'Query', myPersonalInfo: { __typename?: 'Profile', id: string, userId: string, firstName?: string | null, lastName?: string | null, dob: any, gender: string, phone: string, alternatePhone?: string | null, email?: string | null, alternateEmail?: string | null, profileType: string, currentAddressLineOne: string, currentAddressLineTwo: string, currentZipCode: string, addressLineOne: string, addressLineTwo: string, zipCode: string, careOfName?: string | null, careOfContact?: string | null, careOfType?: string | null, country?: { __typename?: 'Country', id: string, capital: string, currency: string, currencyName: string, currencySymbol: string, emoji: string, emojiU: string, iso2: string, iso3: string, latitude: number, longitude: number, name: string, nationality: string, numericCode: string, phoneCode: string, regionName: string, subregionName: string } | null, currentCountry?: { __typename?: 'Country', id: string, capital: string, currency: string, currencyName: string, currencySymbol: string, emoji: string, emojiU: string, iso2: string, iso3: string, latitude: number, longitude: number, name: string, nationality: string, numericCode: string, phoneCode: string, regionName: string, subregionName: string } | null, state?: { __typename?: 'State', id: string, name: string, stateCode: string, countryId: number, latitude?: number | null, longitude?: number | null, type?: string | null } | null, currentState?: { __typename?: 'State', id: string, name: string, stateCode: string, countryId: number, latitude?: number | null, longitude?: number | null, type?: string | null } | null, city?: { __typename?: 'City', id: string, stateId: number, name: string, wikiDataId?: string | null, latitude?: number | null, longitude?: number | null } | null, currentCity?: { __typename?: 'City', id: string, stateId: number, name: string, wikiDataId?: string | null, latitude?: number | null, longitude?: number | null } | null } };

export type ProfileByIdQueryVariables = Exact<{
  profileId: Scalars['String']['input'];
}>;


export type ProfileByIdQuery = { __typename?: 'Query', profileById: { __typename?: 'Profile', id: string, userId: string, firstName?: string | null, lastName?: string | null, dob: any, gender: string, phone: string, alternatePhone?: string | null, email?: string | null, alternateEmail?: string | null, profileType: string, currentAddressLineOne: string, currentAddressLineTwo: string, currentZipCode: string, addressLineOne: string, addressLineTwo: string, zipCode: string, careOfName?: string | null, careOfContact?: string | null, careOfType?: string | null, country?: { __typename?: 'Country', id: string, capital: string, currency: string, currencyName: string, currencySymbol: string, emoji: string, emojiU: string, iso2: string, iso3: string, latitude: number, longitude: number, name: string, nationality: string, numericCode: string, phoneCode: string, regionName: string, subregionName: string } | null, currentCountry?: { __typename?: 'Country', id: string, capital: string, currency: string, currencyName: string, currencySymbol: string, emoji: string, emojiU: string, iso2: string, iso3: string, latitude: number, longitude: number, name: string, nationality: string, numericCode: string, phoneCode: string, regionName: string, subregionName: string } | null, state?: { __typename?: 'State', id: string, name: string, stateCode: string, countryId: number, latitude?: number | null, longitude?: number | null, type?: string | null } | null, currentState?: { __typename?: 'State', id: string, name: string, stateCode: string, countryId: number, latitude?: number | null, longitude?: number | null, type?: string | null } | null, city?: { __typename?: 'City', id: string, stateId: number, name: string, wikiDataId?: string | null, latitude?: number | null, longitude?: number | null } | null, currentCity?: { __typename?: 'City', id: string, stateId: number, name: string, wikiDataId?: string | null, latitude?: number | null, longitude?: number | null } | null, educations?: Array<{ __typename?: 'Education', id: string, profileId: number, startDate: any, endDate: any, fieldOfStudy: string, degree: string, college: string, grade?: string | null, activitiesAndSocities?: string | null, isDeleted: boolean }> | null, workExperience?: Array<{ __typename?: 'WorkExperience', id: string, profileId: number, title: string, employmentType: string, companyName: string, location: string, locationType: string, startDate: any, endDate: any, description: string, isDeleted: boolean }> | null, candidateSkills?: Array<{ __typename?: 'CandidateSkill', id: string, name: string, profileId: number, workExperience?: string | null, internship?: string | null, isDeleted?: boolean | null, recordedBy?: string | null, lastModifiedBy?: string | null }> | null, additionalInfo?: { __typename?: 'AdditionalInfo', id: string, profileId: number, coveringLetter?: string | null, statementOfPurpose?: string | null } | null, questionaireAnswer?: Array<{ __typename?: 'QuestionaireAnswer', id: string, profileId?: number | null, questionId: number, answer: string, question?: { __typename?: 'Question', id: string, text?: string | null } | null }> | null } };

export type QuestionaireAnsFragment = { __typename?: 'QuestionaireAnswer', id: string, profileId?: number | null, questionId: number, answer: string };

export type SaveQuestionaireAnswerMutationVariables = Exact<{
  questions: Array<SaveQuestionaireAnsInput> | SaveQuestionaireAnsInput;
}>;


export type SaveQuestionaireAnswerMutation = { __typename?: 'Mutation', saveQuestionaireAnswer: Array<{ __typename?: 'QuestionaireAnswer', id: string, profileId?: number | null, questionId: number, answer: string }> };

export type QuestionaireAnsQueryVariables = Exact<{
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
}>;


export type QuestionaireAnsQuery = { __typename?: 'Query', questionaireAns: { __typename?: 'QuestionaireAnswerConnection', edges: Array<{ __typename?: 'QuestionaireAnswerEdge', cursor: string, node: { __typename?: 'QuestionaireAnswer', id: string, profileId?: number | null, questionId: number, answer: string, question?: { __typename?: 'Question', id: string, text?: string | null } | null } }> } };

export type QuestionFragment = { __typename?: 'Question', id: string, text?: string | null };

export type QuestionsQueryVariables = Exact<{
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
}>;


export type QuestionsQuery = { __typename?: 'Query', questions: { __typename?: 'QuestionConnection', edges: Array<{ __typename?: 'QuestionEdge', cursor: string, node: { __typename?: 'Question', id: string, text?: string | null } }> } };

export type StateFragmentFragment = { __typename?: 'State', id: string, name: string, stateCode: string, countryId: number, latitude?: number | null, longitude?: number | null, type?: string | null };

export type StatesQueryVariables = Exact<{
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
  countryId?: InputMaybe<Scalars['Float']['input']>;
}>;


export type StatesQuery = { __typename?: 'Query', states: { __typename?: 'StateConnection', edges: Array<{ __typename?: 'StateEdge', cursor: string, node: { __typename?: 'State', id: string, name: string, stateCode: string, countryId: number, latitude?: number | null, longitude?: number | null, type?: string | null } }> } };

export type FormSubmissionFragmentFragment = { __typename?: 'Submission', id: string, formId: number, jsonData: string, formAlternateId: string };

export type AddFormSubmissionMutationVariables = Exact<{
  input: SubmissionInput;
}>;


export type AddFormSubmissionMutation = { __typename?: 'Mutation', addFormSubmission: { __typename?: 'Submission', id: string, formId: number, jsonData: string, formAlternateId: string } };

export type GetFormSubmissionQueryVariables = Exact<{
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GetFormSubmissionQuery = { __typename?: 'Query', getFormSubmission: { __typename?: 'SubmissionConnection', edges: Array<{ __typename?: 'SubmissionEdge', cursor: string, node: { __typename?: 'Submission', id: string, formId: number, jsonData: string, formAlternateId: string } }> } };

export type GetFormSubmissionByFormIdQueryVariables = Exact<{
  formId: Scalars['Float']['input'];
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GetFormSubmissionByFormIdQuery = { __typename?: 'Query', getFormSubmissionByFormId: { __typename?: 'SubmissionConnection', edges: Array<{ __typename?: 'SubmissionEdge', cursor: string, node: { __typename?: 'Submission', id: string, formId: number, jsonData: string, formAlternateId: string } }> } };

export type Upload_GetSignedUrlQueryVariables = Exact<{
  input: UploadInput;
}>;


export type Upload_GetSignedUrlQuery = { __typename?: 'Query', upload_getSignedUrl: string };

export type UserFragmentFragment = { __typename?: 'User', id: string, name?: string | null, firstName?: string | null, lastName?: string | null, email: string, organisationName?: string | null, accessType: string };

export type RegisterCompanyAdminMutationVariables = Exact<{
  input: CompanyAdminInput;
}>;


export type RegisterCompanyAdminMutation = { __typename?: 'Mutation', registerCompanyAdmin: { __typename?: 'User', id: string, name?: string | null, firstName?: string | null, lastName?: string | null, email: string, organisationName?: string | null, accessType: string } };

export type RegisterUserMutationVariables = Exact<{
  input: UserInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'User', id: string, name?: string | null, firstName?: string | null, lastName?: string | null, email: string, organisationName?: string | null, accessType: string } };

export type ViewerQueryVariables = Exact<{ [key: string]: never; }>;


export type ViewerQuery = { __typename?: 'Query', viewer: { __typename?: 'Viewer', expires?: any | null, user?: { __typename?: 'User', id: string, name?: string | null, firstName?: string | null, lastName?: string | null, email: string, organisationName?: string | null, accessType: string, profile?: { __typename?: 'Profile', id: string, userId: string, firstName?: string | null, lastName?: string | null, dob: any, gender: string, phone: string, alternatePhone?: string | null, email?: string | null, alternateEmail?: string | null, profileType: string, currentAddressLineOne: string, currentAddressLineTwo: string, currentZipCode: string, addressLineOne: string, addressLineTwo: string, zipCode: string, careOfName?: string | null, careOfContact?: string | null, careOfType?: string | null, country?: { __typename?: 'Country', id: string, capital: string, currency: string, currencyName: string, currencySymbol: string, emoji: string, emojiU: string, iso2: string, iso3: string, latitude: number, longitude: number, name: string, nationality: string, numericCode: string, phoneCode: string, regionName: string, subregionName: string } | null, currentCountry?: { __typename?: 'Country', id: string, capital: string, currency: string, currencyName: string, currencySymbol: string, emoji: string, emojiU: string, iso2: string, iso3: string, latitude: number, longitude: number, name: string, nationality: string, numericCode: string, phoneCode: string, regionName: string, subregionName: string } | null, state?: { __typename?: 'State', id: string, name: string, stateCode: string, countryId: number, latitude?: number | null, longitude?: number | null, type?: string | null } | null, currentState?: { __typename?: 'State', id: string, name: string, stateCode: string, countryId: number, latitude?: number | null, longitude?: number | null, type?: string | null } | null, city?: { __typename?: 'City', id: string, stateId: number, name: string, wikiDataId?: string | null, latitude?: number | null, longitude?: number | null } | null, currentCity?: { __typename?: 'City', id: string, stateId: number, name: string, wikiDataId?: string | null, latitude?: number | null, longitude?: number | null } | null } | null } | null } };

export type WorkExperienceFragment = { __typename?: 'WorkExperience', id: string, profileId: number, title: string, employmentType: string, companyName: string, location: string, locationType: string, startDate: any, endDate: any, description: string, isDeleted: boolean };

export type RemoveWorkExperienceByIdMutationVariables = Exact<{
  workExperienceId: Scalars['Float']['input'];
}>;


export type RemoveWorkExperienceByIdMutation = { __typename?: 'Mutation', removeWorkExperienceById: { __typename?: 'WorkExperience', id: string, profileId: number, title: string, employmentType: string, companyName: string, location: string, locationType: string, startDate: any, endDate: any, description: string, isDeleted: boolean, assets?: Array<{ __typename?: 'Asset', id: string, name?: string | null, url?: string | null, fileType?: string | null, type: string, desc: string, isDeleted: boolean }> | null } };

export type SaveWorkExperienceMutationVariables = Exact<{
  input: SaveWorkExperienceInput;
}>;


export type SaveWorkExperienceMutation = { __typename?: 'Mutation', saveWorkExperience: { __typename?: 'WorkExperience', id: string, profileId: number, title: string, employmentType: string, companyName: string, location: string, locationType: string, startDate: any, endDate: any, description: string, isDeleted: boolean, assets?: Array<{ __typename?: 'Asset', id: string, name?: string | null, url?: string | null, fileType?: string | null, type: string, desc: string, isDeleted: boolean }> | null } };

export type UpdateWorkExperienceByIdMutationVariables = Exact<{
  input: SaveWorkExperienceInput;
  workExperienceId: Scalars['Float']['input'];
}>;


export type UpdateWorkExperienceByIdMutation = { __typename?: 'Mutation', updateWorkExperienceById: { __typename?: 'WorkExperience', id: string, profileId: number, title: string, employmentType: string, companyName: string, location: string, locationType: string, startDate: any, endDate: any, description: string, isDeleted: boolean, assets?: Array<{ __typename?: 'Asset', id: string, name?: string | null, url?: string | null, fileType?: string | null, type: string, desc: string, isDeleted: boolean }> | null } };

export type GetWorkExperienceByIdQueryVariables = Exact<{
  workExperienceId: Scalars['Float']['input'];
}>;


export type GetWorkExperienceByIdQuery = { __typename?: 'Query', getWorkExperienceById: { __typename?: 'WorkExperience', id: string, profileId: number, title: string, employmentType: string, companyName: string, location: string, locationType: string, startDate: any, endDate: any, description: string, isDeleted: boolean, assets?: Array<{ __typename?: 'Asset', id: string, name?: string | null, url?: string | null, fileType?: string | null, type: string, desc: string, isDeleted: boolean }> | null } };

export type MyWorkExperienceQueryVariables = Exact<{
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  last?: InputMaybe<Scalars['Float']['input']>;
}>;


export type MyWorkExperienceQuery = { __typename?: 'Query', myWorkExperience: { __typename?: 'WorkExperienceConnection', edges: Array<{ __typename?: 'WorkExperienceEdge', cursor: string, node: { __typename?: 'WorkExperience', id: string, profileId: number, title: string, employmentType: string, companyName: string, location: string, locationType: string, startDate: any, endDate: any, description: string, isDeleted: boolean, assets?: Array<{ __typename?: 'Asset', id: string, name?: string | null, url?: string | null, fileType?: string | null, type: string, desc: string, isDeleted: boolean }> | null } }> } };

export const PageInfoFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"pageInfoFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PageInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]} as unknown as DocumentNode<PageInfoFragmentFragment, unknown>;
export const AchievementAwardFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"achievementAward"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AchievementAward"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"associatedWith"}},{"kind":"Field","name":{"kind":"Name","value":"issuer"}},{"kind":"Field","name":{"kind":"Name","value":"issuerDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<AchievementAwardFragment, unknown>;
export const AdditionalInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"additionalInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdditionalInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"coveringLetter"}},{"kind":"Field","name":{"kind":"Name","value":"statementOfPurpose"}}]}}]} as unknown as DocumentNode<AdditionalInfoFragment, unknown>;
export const AssetFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<AssetFragment, unknown>;
export const CandidateSkillFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"candidateSkill"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CandidateSkill"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"workExperience"}},{"kind":"Field","name":{"kind":"Name","value":"internship"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"recordedBy"}},{"kind":"Field","name":{"kind":"Name","value":"lastModifiedBy"}}]}}]} as unknown as DocumentNode<CandidateSkillFragment, unknown>;
export const CityFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"cityFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"City"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stateId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"wikiDataId"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]} as unknown as DocumentNode<CityFragmentFragment, unknown>;
export const CountriesFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"countriesFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Country"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"capital"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"currencyName"}},{"kind":"Field","name":{"kind":"Name","value":"currencySymbol"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"emojiU"}},{"kind":"Field","name":{"kind":"Name","value":"iso2"}},{"kind":"Field","name":{"kind":"Name","value":"iso3"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"numericCode"}},{"kind":"Field","name":{"kind":"Name","value":"phoneCode"}},{"kind":"Field","name":{"kind":"Name","value":"regionName"}},{"kind":"Field","name":{"kind":"Name","value":"subregionName"}}]}}]} as unknown as DocumentNode<CountriesFragmentFragment, unknown>;
export const EducationFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"educationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Education"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"fieldOfStudy"}},{"kind":"Field","name":{"kind":"Name","value":"degree"}},{"kind":"Field","name":{"kind":"Name","value":"college"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"activitiesAndSocities"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<EducationFragmentFragment, unknown>;
export const FormDataFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"formDataFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"alternateFormId"}},{"kind":"Field","name":{"kind":"Name","value":"templateRow"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkName"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkDesc"}}]}}]} as unknown as DocumentNode<FormDataFragmentFragment, unknown>;
export const DocumentFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"documentFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"formId"}},{"kind":"Field","name":{"kind":"Name","value":"formAlternateId"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isPdf"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<DocumentFragmentFragment, unknown>;
export const ProfileFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"profileFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Profile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"alternatePhone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"alternateEmail"}},{"kind":"Field","name":{"kind":"Name","value":"profileType"}},{"kind":"Field","name":{"kind":"Name","value":"currentAddressLineOne"}},{"kind":"Field","name":{"kind":"Name","value":"currentAddressLineTwo"}},{"kind":"Field","name":{"kind":"Name","value":"currentZipCode"}},{"kind":"Field","name":{"kind":"Name","value":"addressLineOne"}},{"kind":"Field","name":{"kind":"Name","value":"addressLineTwo"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"careOfName"}},{"kind":"Field","name":{"kind":"Name","value":"careOfContact"}},{"kind":"Field","name":{"kind":"Name","value":"careOfType"}}]}}]} as unknown as DocumentNode<ProfileFragmentFragment, unknown>;
export const QuestionaireAnsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"questionaireAns"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionaireAnswer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"questionId"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]} as unknown as DocumentNode<QuestionaireAnsFragment, unknown>;
export const QuestionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Question"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]} as unknown as DocumentNode<QuestionFragment, unknown>;
export const StateFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stateFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"State"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"stateCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryId"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<StateFragmentFragment, unknown>;
export const FormSubmissionFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"formSubmissionFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Submission"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"formId"}},{"kind":"Field","name":{"kind":"Name","value":"jsonData"}},{"kind":"Field","name":{"kind":"Name","value":"formAlternateId"}}]}}]} as unknown as DocumentNode<FormSubmissionFragmentFragment, unknown>;
export const UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"organisationName"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}}]}}]} as unknown as DocumentNode<UserFragmentFragment, unknown>;
export const WorkExperienceFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"workExperience"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WorkExperience"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"employmentType"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"locationType"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<WorkExperienceFragment, unknown>;
export const RemoveAchievementAwardByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveAchievementAwardById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"achievementAwardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeAchievementAwardById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"achievementAwardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"achievementAwardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"achievementAward"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"asset"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"achievementAward"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AchievementAward"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"associatedWith"}},{"kind":"Field","name":{"kind":"Name","value":"issuer"}},{"kind":"Field","name":{"kind":"Name","value":"issuerDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<RemoveAchievementAwardByIdMutation, RemoveAchievementAwardByIdMutationVariables>;
export const SaveAchievementAwardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveAchievementAward"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveAchievementAwardInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveAchievementAward"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"achievementAward"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"asset"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"achievementAward"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AchievementAward"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"associatedWith"}},{"kind":"Field","name":{"kind":"Name","value":"issuer"}},{"kind":"Field","name":{"kind":"Name","value":"issuerDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<SaveAchievementAwardMutation, SaveAchievementAwardMutationVariables>;
export const UpdateAchievementAwardByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAchievementAwardById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveAchievementAwardInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"achievementAwardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAchievementAwardById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"achievementAwardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"achievementAwardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"achievementAward"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"asset"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"achievementAward"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AchievementAward"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"associatedWith"}},{"kind":"Field","name":{"kind":"Name","value":"issuer"}},{"kind":"Field","name":{"kind":"Name","value":"issuerDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<UpdateAchievementAwardByIdMutation, UpdateAchievementAwardByIdMutationVariables>;
export const AchievementAwardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AchievementAwards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"achievementAwards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"achievementAward"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"asset"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"achievementAward"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AchievementAward"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"associatedWith"}},{"kind":"Field","name":{"kind":"Name","value":"issuer"}},{"kind":"Field","name":{"kind":"Name","value":"issuerDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<AchievementAwardsQuery, AchievementAwardsQueryVariables>;
export const GetAwardByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAwardById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"awardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAwardById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"awardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"awardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"achievementAward"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"asset"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"achievementAward"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AchievementAward"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"associatedWith"}},{"kind":"Field","name":{"kind":"Name","value":"issuer"}},{"kind":"Field","name":{"kind":"Name","value":"issuerDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<GetAwardByIdQuery, GetAwardByIdQueryVariables>;
export const SaveAdditonalInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveAdditonalInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveAdditionalInfoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveAdditonalInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"additionalInfo"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"additionalInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdditionalInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"coveringLetter"}},{"kind":"Field","name":{"kind":"Name","value":"statementOfPurpose"}}]}}]} as unknown as DocumentNode<SaveAdditonalInfoMutation, SaveAdditonalInfoMutationVariables>;
export const AddionalInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AddionalInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addionalInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"coveringLetter"}},{"kind":"Field","name":{"kind":"Name","value":"statementOfPurpose"}}]}}]}}]} as unknown as DocumentNode<AddionalInfoQuery, AddionalInfoQueryVariables>;
export const RemoveAssetByAchievementAwardByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveAssetByAchievementAwardById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"achievementAwardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeAssetByAchievementAwardById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"achievementAwardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"achievementAwardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"asset"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<RemoveAssetByAchievementAwardByIdMutation, RemoveAssetByAchievementAwardByIdMutationVariables>;
export const RemoveAssetByWorkExperienceByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveAssetByWorkExperienceById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workExperienceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeAssetByWorkExperienceById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workExperienceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workExperienceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"asset"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<RemoveAssetByWorkExperienceByIdMutation, RemoveAssetByWorkExperienceByIdMutationVariables>;
export const ChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangePasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"organisationName"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}}]}}]} as unknown as DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CreatePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"organisationName"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}}]}}]} as unknown as DocumentNode<CreatePasswordMutation, CreatePasswordMutationVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResetPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const SendForgetPassLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendForgetPassLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendForgetPassLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<SendForgetPassLinkMutation, SendForgetPassLinkMutationVariables>;
export const RemoveCandidateSkillDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveCandidateSkill"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"candidateSkillId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removecandidateSkill"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"candidateSkillId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"candidateSkillId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"candidateSkill"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"candidateSkill"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CandidateSkill"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"workExperience"}},{"kind":"Field","name":{"kind":"Name","value":"internship"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"recordedBy"}},{"kind":"Field","name":{"kind":"Name","value":"lastModifiedBy"}}]}}]} as unknown as DocumentNode<RemoveCandidateSkillMutation, RemoveCandidateSkillMutationVariables>;
export const SaveCandidateSkillDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveCandidateSkill"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveCandidateSkillsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveCandidateSkill"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"candidateSkill"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"candidateSkill"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CandidateSkill"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"workExperience"}},{"kind":"Field","name":{"kind":"Name","value":"internship"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"recordedBy"}},{"kind":"Field","name":{"kind":"Name","value":"lastModifiedBy"}}]}}]} as unknown as DocumentNode<SaveCandidateSkillMutation, SaveCandidateSkillMutationVariables>;
export const UpdateCandidateSkillByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCandidateSkillById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveCandidateSkillsInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"candidateSkillId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCandidateSkillById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"candidateSkillId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"candidateSkillId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"candidateSkill"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"candidateSkill"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CandidateSkill"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"workExperience"}},{"kind":"Field","name":{"kind":"Name","value":"internship"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"recordedBy"}},{"kind":"Field","name":{"kind":"Name","value":"lastModifiedBy"}}]}}]} as unknown as DocumentNode<UpdateCandidateSkillByIdMutation, UpdateCandidateSkillByIdMutationVariables>;
export const CandidateSkillsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CandidateSkills"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"candidateSkills"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"candidateSkill"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"candidateSkill"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CandidateSkill"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"workExperience"}},{"kind":"Field","name":{"kind":"Name","value":"internship"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"recordedBy"}},{"kind":"Field","name":{"kind":"Name","value":"lastModifiedBy"}}]}}]} as unknown as DocumentNode<CandidateSkillsQuery, CandidateSkillsQueryVariables>;
export const GetcandidateSkillByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetcandidateSkillById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"candidateSkillId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getcandidateSkillById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"candidateSkillId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"candidateSkillId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"candidateSkill"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"candidateSkill"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CandidateSkill"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"workExperience"}},{"kind":"Field","name":{"kind":"Name","value":"internship"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"recordedBy"}},{"kind":"Field","name":{"kind":"Name","value":"lastModifiedBy"}}]}}]} as unknown as DocumentNode<GetcandidateSkillByIdQuery, GetcandidateSkillByIdQueryVariables>;
export const CitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Cities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stateId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"stateId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stateId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"cityFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"cityFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"City"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stateId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"wikiDataId"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]} as unknown as DocumentNode<CitiesQuery, CitiesQueryVariables>;
export const CountriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Countries"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"countriesFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"countriesFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Country"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"capital"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"currencyName"}},{"kind":"Field","name":{"kind":"Name","value":"currencySymbol"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"emojiU"}},{"kind":"Field","name":{"kind":"Name","value":"iso2"}},{"kind":"Field","name":{"kind":"Name","value":"iso3"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"numericCode"}},{"kind":"Field","name":{"kind":"Name","value":"phoneCode"}},{"kind":"Field","name":{"kind":"Name","value":"regionName"}},{"kind":"Field","name":{"kind":"Name","value":"subregionName"}}]}}]} as unknown as DocumentNode<CountriesQuery, CountriesQueryVariables>;
export const RemoveEducationAndQualificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveEducationAndQualification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"educationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeEducationAndQualification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"educationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"educationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"educationFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"educationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Education"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"fieldOfStudy"}},{"kind":"Field","name":{"kind":"Name","value":"degree"}},{"kind":"Field","name":{"kind":"Name","value":"college"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"activitiesAndSocities"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<RemoveEducationAndQualificationMutation, RemoveEducationAndQualificationMutationVariables>;
export const SaveEducationAndQualificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveEducationAndQualification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveEducationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveEducationAndQualification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"educationFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"educationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Education"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"fieldOfStudy"}},{"kind":"Field","name":{"kind":"Name","value":"degree"}},{"kind":"Field","name":{"kind":"Name","value":"college"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"activitiesAndSocities"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<SaveEducationAndQualificationMutation, SaveEducationAndQualificationMutationVariables>;
export const UpdateEducationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEducationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveEducationInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"educationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEducationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"educationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"educationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"educationFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"educationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Education"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"fieldOfStudy"}},{"kind":"Field","name":{"kind":"Name","value":"degree"}},{"kind":"Field","name":{"kind":"Name","value":"college"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"activitiesAndSocities"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<UpdateEducationByIdMutation, UpdateEducationByIdMutationVariables>;
export const GetEducationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEducationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"educationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEducationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"educationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"educationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"educationFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"educationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Education"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"fieldOfStudy"}},{"kind":"Field","name":{"kind":"Name","value":"degree"}},{"kind":"Field","name":{"kind":"Name","value":"college"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"activitiesAndSocities"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<GetEducationByIdQuery, GetEducationByIdQueryVariables>;
export const EducationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Educations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"educations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"educationFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"educationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Education"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"fieldOfStudy"}},{"kind":"Field","name":{"kind":"Name","value":"degree"}},{"kind":"Field","name":{"kind":"Name","value":"college"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"activitiesAndSocities"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<EducationsQuery, EducationsQueryVariables>;
export const AddFormDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddFormData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FormDataInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addFormData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"formDataFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"formDataFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"alternateFormId"}},{"kind":"Field","name":{"kind":"Name","value":"templateRow"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkName"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkDesc"}}]}}]} as unknown as DocumentNode<AddFormDataMutation, AddFormDataMutationVariables>;
export const AddLinkNameDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddLinkNameData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LinkNameFormData"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addLinkNameData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"formDataFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"formDataFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"alternateFormId"}},{"kind":"Field","name":{"kind":"Name","value":"templateRow"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkName"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkDesc"}}]}}]} as unknown as DocumentNode<AddLinkNameDataMutation, AddLinkNameDataMutationVariables>;
export const DeleteFormDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteFormData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteFormDataInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFormData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"formDataFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"formDataFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"alternateFormId"}},{"kind":"Field","name":{"kind":"Name","value":"templateRow"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkName"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkDesc"}}]}}]} as unknown as DocumentNode<DeleteFormDataMutation, DeleteFormDataMutationVariables>;
export const PublishFormDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PublishFormData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PulishFormDataInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publishFormData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"formDataFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"formDataFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"alternateFormId"}},{"kind":"Field","name":{"kind":"Name","value":"templateRow"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkName"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkDesc"}}]}}]} as unknown as DocumentNode<PublishFormDataMutation, PublishFormDataMutationVariables>;
export const UpdateFormDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFormData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFormDataInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFormData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"formDataFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"formDataFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"alternateFormId"}},{"kind":"Field","name":{"kind":"Name","value":"templateRow"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkName"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkDesc"}}]}}]} as unknown as DocumentNode<UpdateFormDataMutation, UpdateFormDataMutationVariables>;
export const FormDataByFormIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FormDataByFormId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formDataByFormId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"formId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"formDataFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"formDataFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"alternateFormId"}},{"kind":"Field","name":{"kind":"Name","value":"templateRow"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkName"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkDesc"}}]}}]} as unknown as DocumentNode<FormDataByFormIdQuery, FormDataByFormIdQueryVariables>;
export const FormDataByFormLinkNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FormDataByFormLinkName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formLinkName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formDataByFormLinkName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"formLinkName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formLinkName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"formDataFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"formDataFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"alternateFormId"}},{"kind":"Field","name":{"kind":"Name","value":"templateRow"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkName"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkDesc"}}]}}]} as unknown as DocumentNode<FormDataByFormLinkNameQuery, FormDataByFormLinkNameQueryVariables>;
export const FormDataByUserIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FormDataByUserId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formDataByUserId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"formDataFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"formDataFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"alternateFormId"}},{"kind":"Field","name":{"kind":"Name","value":"templateRow"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkName"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkDesc"}}]}}]} as unknown as DocumentNode<FormDataByUserIdQuery, FormDataByUserIdQueryVariables>;
export const GetAllFormDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllFormData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isDeleted"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllFormData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"isDeleted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isDeleted"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"formDataFragment"}},{"kind":"Field","name":{"kind":"Name","value":"submissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"formSubmissionFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userFragment"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"formDataFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"alternateFormId"}},{"kind":"Field","name":{"kind":"Name","value":"templateRow"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkName"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkDesc"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"formSubmissionFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Submission"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"formId"}},{"kind":"Field","name":{"kind":"Name","value":"jsonData"}},{"kind":"Field","name":{"kind":"Name","value":"formAlternateId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"organisationName"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}}]}}]} as unknown as DocumentNode<GetAllFormDataQuery, GetAllFormDataQueryVariables>;
export const GetTemplateByFormIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTemplateByFormId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTemplateByFormId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"formId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"formDataFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"formDataFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"alternateFormId"}},{"kind":"Field","name":{"kind":"Name","value":"templateRow"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkName"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkDesc"}}]}}]} as unknown as DocumentNode<GetTemplateByFormIdQuery, GetTemplateByFormIdQueryVariables>;
export const MyFormDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyFormData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isDeleted"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myFormData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"isDeleted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isDeleted"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"formDataFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"formDataFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"alternateFormId"}},{"kind":"Field","name":{"kind":"Name","value":"templateRow"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkName"}},{"kind":"Field","name":{"kind":"Name","value":"formLinkDesc"}}]}}]} as unknown as DocumentNode<MyFormDataQuery, MyFormDataQueryVariables>;
export const RemoveFormDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveFormDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeFormDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"documentFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"documentFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"formId"}},{"kind":"Field","name":{"kind":"Name","value":"formAlternateId"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isPdf"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<RemoveFormDocumentMutation, RemoveFormDocumentMutationVariables>;
export const UpdateFormDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFormDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFormDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"documentFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"documentFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"formId"}},{"kind":"Field","name":{"kind":"Name","value":"formAlternateId"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isPdf"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<UpdateFormDocumentMutation, UpdateFormDocumentMutationVariables>;
export const GetFileByFormIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFileByFormId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFileByFormId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"formId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"documentFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"documentFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"formId"}},{"kind":"Field","name":{"kind":"Name","value":"formAlternateId"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isPdf"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<GetFileByFormIdQuery, GetFileByFormIdQueryVariables>;
export const GetFilesByFormIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFilesByFormId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFilesByFormId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"formId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formId"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"documentFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"documentFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"formId"}},{"kind":"Field","name":{"kind":"Name","value":"formAlternateId"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isPdf"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<GetFilesByFormIdQuery, GetFilesByFormIdQueryVariables>;
export const SavePersonalInformationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SavePersonalInformation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SavePersonalInfoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"savePersonalInformation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"profileFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"profileFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Profile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"alternatePhone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"alternateEmail"}},{"kind":"Field","name":{"kind":"Name","value":"profileType"}},{"kind":"Field","name":{"kind":"Name","value":"currentAddressLineOne"}},{"kind":"Field","name":{"kind":"Name","value":"currentAddressLineTwo"}},{"kind":"Field","name":{"kind":"Name","value":"currentZipCode"}},{"kind":"Field","name":{"kind":"Name","value":"addressLineOne"}},{"kind":"Field","name":{"kind":"Name","value":"addressLineTwo"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"careOfName"}},{"kind":"Field","name":{"kind":"Name","value":"careOfContact"}},{"kind":"Field","name":{"kind":"Name","value":"careOfType"}}]}}]} as unknown as DocumentNode<SavePersonalInformationMutation, SavePersonalInformationMutationVariables>;
export const MyPersonalInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyPersonalInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPersonalInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"profileFragment"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"countriesFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentCountry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"countriesFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stateFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stateFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"cityFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentCity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"cityFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"profileFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Profile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"alternatePhone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"alternateEmail"}},{"kind":"Field","name":{"kind":"Name","value":"profileType"}},{"kind":"Field","name":{"kind":"Name","value":"currentAddressLineOne"}},{"kind":"Field","name":{"kind":"Name","value":"currentAddressLineTwo"}},{"kind":"Field","name":{"kind":"Name","value":"currentZipCode"}},{"kind":"Field","name":{"kind":"Name","value":"addressLineOne"}},{"kind":"Field","name":{"kind":"Name","value":"addressLineTwo"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"careOfName"}},{"kind":"Field","name":{"kind":"Name","value":"careOfContact"}},{"kind":"Field","name":{"kind":"Name","value":"careOfType"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"countriesFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Country"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"capital"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"currencyName"}},{"kind":"Field","name":{"kind":"Name","value":"currencySymbol"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"emojiU"}},{"kind":"Field","name":{"kind":"Name","value":"iso2"}},{"kind":"Field","name":{"kind":"Name","value":"iso3"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"numericCode"}},{"kind":"Field","name":{"kind":"Name","value":"phoneCode"}},{"kind":"Field","name":{"kind":"Name","value":"regionName"}},{"kind":"Field","name":{"kind":"Name","value":"subregionName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stateFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"State"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"stateCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryId"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"cityFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"City"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stateId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"wikiDataId"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]} as unknown as DocumentNode<MyPersonalInfoQuery, MyPersonalInfoQueryVariables>;
export const ProfileByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProfileById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profileById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"profileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profileId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"profileFragment"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"countriesFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentCountry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"countriesFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stateFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stateFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"cityFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentCity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"cityFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"educations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"educationFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workExperience"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"workExperience"}}]}},{"kind":"Field","name":{"kind":"Name","value":"candidateSkills"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"candidateSkill"}}]}},{"kind":"Field","name":{"kind":"Name","value":"additionalInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"additionalInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"questionaireAnswer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"questionaireAns"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"question"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"profileFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Profile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"alternatePhone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"alternateEmail"}},{"kind":"Field","name":{"kind":"Name","value":"profileType"}},{"kind":"Field","name":{"kind":"Name","value":"currentAddressLineOne"}},{"kind":"Field","name":{"kind":"Name","value":"currentAddressLineTwo"}},{"kind":"Field","name":{"kind":"Name","value":"currentZipCode"}},{"kind":"Field","name":{"kind":"Name","value":"addressLineOne"}},{"kind":"Field","name":{"kind":"Name","value":"addressLineTwo"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"careOfName"}},{"kind":"Field","name":{"kind":"Name","value":"careOfContact"}},{"kind":"Field","name":{"kind":"Name","value":"careOfType"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"countriesFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Country"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"capital"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"currencyName"}},{"kind":"Field","name":{"kind":"Name","value":"currencySymbol"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"emojiU"}},{"kind":"Field","name":{"kind":"Name","value":"iso2"}},{"kind":"Field","name":{"kind":"Name","value":"iso3"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"numericCode"}},{"kind":"Field","name":{"kind":"Name","value":"phoneCode"}},{"kind":"Field","name":{"kind":"Name","value":"regionName"}},{"kind":"Field","name":{"kind":"Name","value":"subregionName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stateFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"State"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"stateCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryId"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"cityFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"City"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stateId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"wikiDataId"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"educationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Education"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"fieldOfStudy"}},{"kind":"Field","name":{"kind":"Name","value":"degree"}},{"kind":"Field","name":{"kind":"Name","value":"college"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"activitiesAndSocities"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"workExperience"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WorkExperience"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"employmentType"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"locationType"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"candidateSkill"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CandidateSkill"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"workExperience"}},{"kind":"Field","name":{"kind":"Name","value":"internship"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"recordedBy"}},{"kind":"Field","name":{"kind":"Name","value":"lastModifiedBy"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"additionalInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdditionalInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"coveringLetter"}},{"kind":"Field","name":{"kind":"Name","value":"statementOfPurpose"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"questionaireAns"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionaireAnswer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"questionId"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Question"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]} as unknown as DocumentNode<ProfileByIdQuery, ProfileByIdQueryVariables>;
export const SaveQuestionaireAnswerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveQuestionaireAnswer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"questions"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveQuestionaireAnsInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveQuestionaireAnswer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"questions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"questions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"questionaireAns"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"questionaireAns"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionaireAnswer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"questionId"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]} as unknown as DocumentNode<SaveQuestionaireAnswerMutation, SaveQuestionaireAnswerMutationVariables>;
export const QuestionaireAnsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"QuestionaireAns"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"questionaireAns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"questionaireAns"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"question"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"questionaireAns"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionaireAnswer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"questionId"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Question"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]} as unknown as DocumentNode<QuestionaireAnsQuery, QuestionaireAnsQueryVariables>;
export const QuestionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Questions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"questions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"question"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Question"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]} as unknown as DocumentNode<QuestionsQuery, QuestionsQueryVariables>;
export const StatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"States"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"countryId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"states"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"countryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"countryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stateFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stateFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"State"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"stateCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryId"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<StatesQuery, StatesQueryVariables>;
export const AddFormSubmissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddFormSubmission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addFormSubmission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"formSubmissionFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"formSubmissionFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Submission"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"formId"}},{"kind":"Field","name":{"kind":"Name","value":"jsonData"}},{"kind":"Field","name":{"kind":"Name","value":"formAlternateId"}}]}}]} as unknown as DocumentNode<AddFormSubmissionMutation, AddFormSubmissionMutationVariables>;
export const GetFormSubmissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFormSubmission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFormSubmission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"formSubmissionFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"formSubmissionFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Submission"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"formId"}},{"kind":"Field","name":{"kind":"Name","value":"jsonData"}},{"kind":"Field","name":{"kind":"Name","value":"formAlternateId"}}]}}]} as unknown as DocumentNode<GetFormSubmissionQuery, GetFormSubmissionQueryVariables>;
export const GetFormSubmissionByFormIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFormSubmissionByFormId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFormSubmissionByFormId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"formId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formId"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"formSubmissionFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"formSubmissionFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Submission"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"formId"}},{"kind":"Field","name":{"kind":"Name","value":"jsonData"}},{"kind":"Field","name":{"kind":"Name","value":"formAlternateId"}}]}}]} as unknown as DocumentNode<GetFormSubmissionByFormIdQuery, GetFormSubmissionByFormIdQueryVariables>;
export const Upload_GetSignedUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Upload_getSignedUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upload_getSignedUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<Upload_GetSignedUrlQuery, Upload_GetSignedUrlQueryVariables>;
export const RegisterCompanyAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterCompanyAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CompanyAdminInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerCompanyAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"organisationName"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}}]}}]} as unknown as DocumentNode<RegisterCompanyAdminMutation, RegisterCompanyAdminMutationVariables>;
export const RegisterUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"organisationName"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}}]}}]} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>;
export const ViewerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Viewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"viewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expires"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userFragment"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"profileFragment"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"countriesFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentCountry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"countriesFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stateFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"stateFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"cityFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentCity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"cityFragment"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"organisationName"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"profileFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Profile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"alternatePhone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"alternateEmail"}},{"kind":"Field","name":{"kind":"Name","value":"profileType"}},{"kind":"Field","name":{"kind":"Name","value":"currentAddressLineOne"}},{"kind":"Field","name":{"kind":"Name","value":"currentAddressLineTwo"}},{"kind":"Field","name":{"kind":"Name","value":"currentZipCode"}},{"kind":"Field","name":{"kind":"Name","value":"addressLineOne"}},{"kind":"Field","name":{"kind":"Name","value":"addressLineTwo"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"careOfName"}},{"kind":"Field","name":{"kind":"Name","value":"careOfContact"}},{"kind":"Field","name":{"kind":"Name","value":"careOfType"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"countriesFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Country"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"capital"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"currencyName"}},{"kind":"Field","name":{"kind":"Name","value":"currencySymbol"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"emojiU"}},{"kind":"Field","name":{"kind":"Name","value":"iso2"}},{"kind":"Field","name":{"kind":"Name","value":"iso3"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"numericCode"}},{"kind":"Field","name":{"kind":"Name","value":"phoneCode"}},{"kind":"Field","name":{"kind":"Name","value":"regionName"}},{"kind":"Field","name":{"kind":"Name","value":"subregionName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"stateFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"State"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"stateCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryId"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"cityFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"City"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stateId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"wikiDataId"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]} as unknown as DocumentNode<ViewerQuery, ViewerQueryVariables>;
export const RemoveWorkExperienceByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveWorkExperienceById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workExperienceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeWorkExperienceById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workExperienceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workExperienceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"workExperience"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"asset"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"workExperience"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WorkExperience"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"employmentType"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"locationType"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<RemoveWorkExperienceByIdMutation, RemoveWorkExperienceByIdMutationVariables>;
export const SaveWorkExperienceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveWorkExperience"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveWorkExperienceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveWorkExperience"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"workExperience"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"asset"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"workExperience"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WorkExperience"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"employmentType"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"locationType"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<SaveWorkExperienceMutation, SaveWorkExperienceMutationVariables>;
export const UpdateWorkExperienceByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWorkExperienceById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveWorkExperienceInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workExperienceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateWorkExperienceById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"workExperienceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workExperienceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"workExperience"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"asset"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"workExperience"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WorkExperience"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"employmentType"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"locationType"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<UpdateWorkExperienceByIdMutation, UpdateWorkExperienceByIdMutationVariables>;
export const GetWorkExperienceByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorkExperienceById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workExperienceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWorkExperienceById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workExperienceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workExperienceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"workExperience"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"asset"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"workExperience"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WorkExperience"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"employmentType"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"locationType"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<GetWorkExperienceByIdQuery, GetWorkExperienceByIdQueryVariables>;
export const MyWorkExperienceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyWorkExperience"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myWorkExperience"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"workExperience"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"asset"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"workExperience"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WorkExperience"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"employmentType"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"locationType"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]} as unknown as DocumentNode<MyWorkExperienceQuery, MyWorkExperienceQueryVariables>;