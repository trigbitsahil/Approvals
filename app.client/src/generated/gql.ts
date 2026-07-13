/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment pageInfoFragment on PageInfo {\n  endCursor\n  hasNextPage\n  hasPreviousPage\n  startCursor\n}": types.PageInfoFragmentFragmentDoc,
    "fragment achievementAward on AchievementAward {\n  id\n  title\n  profileId\n  associatedWith\n  issuer\n  issuerDate\n  description\n  isDeleted\n}": types.AchievementAwardFragmentDoc,
    "mutation RemoveAchievementAwardById($achievementAwardId: Float!) {\n  removeAchievementAwardById(achievementAwardId: $achievementAwardId) {\n    ...achievementAward\n    assets {\n      ...asset\n    }\n  }\n}": types.RemoveAchievementAwardByIdDocument,
    "mutation SaveAchievementAward($input: SaveAchievementAwardInput!) {\n  saveAchievementAward(input: $input) {\n    ...achievementAward\n    assets {\n      ...asset\n    }\n  }\n}": types.SaveAchievementAwardDocument,
    "mutation UpdateAchievementAwardById($input: SaveAchievementAwardInput!, $achievementAwardId: Float!) {\n  updateAchievementAwardById(\n    input: $input\n    achievementAwardId: $achievementAwardId\n  ) {\n    ...achievementAward\n    assets {\n      ...asset\n    }\n  }\n}": types.UpdateAchievementAwardByIdDocument,
    "query AchievementAwards($before: String, $after: String, $first: Float, $last: Float) {\n  achievementAwards(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      cursor\n      node {\n        ...achievementAward\n        assets {\n          ...asset\n        }\n      }\n    }\n  }\n}": types.AchievementAwardsDocument,
    "query GetAwardById($awardId: Float!) {\n  getAwardById(awardId: $awardId) {\n    ...achievementAward\n    assets {\n      ...asset\n    }\n  }\n}": types.GetAwardByIdDocument,
    "fragment additionalInfo on AdditionalInfo {\n  id\n  profileId\n  coveringLetter\n  statementOfPurpose\n}": types.AdditionalInfoFragmentDoc,
    "mutation SaveAdditonalInfo($input: SaveAdditionalInfoInput!) {\n  saveAdditonalInfo(input: $input) {\n    ...additionalInfo\n  }\n}": types.SaveAdditonalInfoDocument,
    "query AddionalInfo {\n  addionalInfo {\n    id\n    profileId\n    coveringLetter\n    statementOfPurpose\n  }\n}": types.AddionalInfoDocument,
    "fragment asset on Asset {\n  id\n  name\n  url\n  fileType\n  type\n  desc\n  isDeleted\n}": types.AssetFragmentDoc,
    "mutation RemoveAssetByAchievementAwardById($achievementAwardId: Float!) {\n  removeAssetByAchievementAwardById(achievementAwardId: $achievementAwardId) {\n    ...asset\n  }\n}": types.RemoveAssetByAchievementAwardByIdDocument,
    "mutation RemoveAssetByWorkExperienceById($workExperienceId: Float!) {\n  removeAssetByWorkExperienceById(workExperienceId: $workExperienceId) {\n    ...asset\n  }\n}": types.RemoveAssetByWorkExperienceByIdDocument,
    "mutation ChangePassword($input: ChangePasswordInput!) {\n  changePassword(input: $input) {\n    ...userFragment\n  }\n}": types.ChangePasswordDocument,
    "mutation CreatePassword($input: CreatePasswordInput!) {\n  createPassword(input: $input) {\n    ...userFragment\n  }\n}": types.CreatePasswordDocument,
    "mutation ResetPassword($input: ResetPasswordInput!) {\n  resetPassword(input: $input)\n}": types.ResetPasswordDocument,
    "mutation SendForgetPassLink($email: String!) {\n  sendForgetPassLink(email: $email)\n}": types.SendForgetPassLinkDocument,
    "fragment candidateSkill on CandidateSkill {\n  id\n  name\n  profileId\n  workExperience\n  internship\n  isDeleted\n  recordedBy\n  lastModifiedBy\n}": types.CandidateSkillFragmentDoc,
    "mutation RemoveCandidateSkill($candidateSkillId: Float!) {\n  removecandidateSkill(candidateSkillId: $candidateSkillId) {\n    ...candidateSkill\n  }\n}": types.RemoveCandidateSkillDocument,
    "mutation SaveCandidateSkill($input: SaveCandidateSkillsInput!) {\n  saveCandidateSkill(input: $input) {\n    ...candidateSkill\n  }\n}": types.SaveCandidateSkillDocument,
    "mutation UpdateCandidateSkillById($input: SaveCandidateSkillsInput!, $candidateSkillId: Float!) {\n  updateCandidateSkillById(input: $input, candidateSkillId: $candidateSkillId) {\n    ...candidateSkill\n  }\n}": types.UpdateCandidateSkillByIdDocument,
    "query CandidateSkills($before: String, $after: String, $first: Float, $last: Float) {\n  candidateSkills(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      cursor\n      node {\n        ...candidateSkill\n      }\n    }\n  }\n}": types.CandidateSkillsDocument,
    "query GetcandidateSkillById($candidateSkillId: Float!) {\n  getcandidateSkillById(candidateSkillId: $candidateSkillId) {\n    ...candidateSkill\n  }\n}": types.GetcandidateSkillByIdDocument,
    "fragment cityFragment on City {\n  id\n  stateId\n  name\n  wikiDataId\n  latitude\n  longitude\n}": types.CityFragmentFragmentDoc,
    "query Cities($before: String, $after: String, $first: Float, $last: Float, $stateId: Float) {\n  cities(\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n    stateId: $stateId\n  ) {\n    edges {\n      cursor\n      node {\n        ...cityFragment\n      }\n    }\n  }\n}": types.CitiesDocument,
    "fragment countriesFragment on Country {\n  id\n  capital\n  currency\n  currencyName\n  currencySymbol\n  emoji\n  emojiU\n  iso2\n  iso3\n  latitude\n  longitude\n  name\n  nationality\n  numericCode\n  phoneCode\n  regionName\n  subregionName\n}": types.CountriesFragmentFragmentDoc,
    "query Countries($before: String, $after: String, $first: Float, $last: Float) {\n  countries(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      node {\n        ...countriesFragment\n      }\n    }\n  }\n}": types.CountriesDocument,
    "fragment educationFragment on Education {\n  id\n  profileId\n  startDate\n  endDate\n  fieldOfStudy\n  degree\n  college\n  grade\n  activitiesAndSocities\n  isDeleted\n}": types.EducationFragmentFragmentDoc,
    "mutation RemoveEducationAndQualification($educationId: Float!) {\n  removeEducationAndQualification(educationId: $educationId) {\n    ...educationFragment\n  }\n}": types.RemoveEducationAndQualificationDocument,
    "mutation SaveEducationAndQualification($input: SaveEducationInput!) {\n  saveEducationAndQualification(input: $input) {\n    ...educationFragment\n  }\n}": types.SaveEducationAndQualificationDocument,
    "mutation UpdateEducationById($input: SaveEducationInput!, $educationId: Float!) {\n  updateEducationById(input: $input, educationId: $educationId) {\n    ...educationFragment\n  }\n}": types.UpdateEducationByIdDocument,
    "query GetEducationById($educationId: Float!) {\n  getEducationById(educationId: $educationId) {\n    ...educationFragment\n  }\n}": types.GetEducationByIdDocument,
    "query Educations($before: String, $after: String, $first: Float, $last: Float) {\n  educations(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      cursor\n      node {\n        ...educationFragment\n      }\n    }\n  }\n}": types.EducationsDocument,
    "fragment formDataFragment on FormData {\n  id\n  userId\n  alternateFormId\n  templateRow\n  isPublished\n  isDeleted\n  createdAt\n  formLinkName\n  formLinkDesc\n}": types.FormDataFragmentFragmentDoc,
    "mutation AddFormData($input: FormDataInput!) {\n  addFormData(input: $input) {\n    ...formDataFragment\n  }\n}": types.AddFormDataDocument,
    "mutation AddLinkNameData($input: LinkNameFormData!) {\n  addLinkNameData(input: $input) {\n    ...formDataFragment\n  }\n}": types.AddLinkNameDataDocument,
    "mutation DeleteFormData($input: DeleteFormDataInput!) {\n  deleteFormData(input: $input) {\n    ...formDataFragment\n  }\n}": types.DeleteFormDataDocument,
    "mutation PublishFormData($input: PulishFormDataInput!) {\n  publishFormData(input: $input) {\n    ...formDataFragment\n  }\n}": types.PublishFormDataDocument,
    "mutation UpdateFormData($input: UpdateFormDataInput!) {\n  updateFormData(input: $input) {\n    ...formDataFragment\n  }\n}": types.UpdateFormDataDocument,
    "query FormDataByFormId($formId: String!) {\n  formDataByFormId(formId: $formId) {\n    ...formDataFragment\n  }\n}": types.FormDataByFormIdDocument,
    "query FormDataByFormLinkName($formLinkName: String!) {\n  formDataByFormLinkName(formLinkName: $formLinkName) {\n    ...formDataFragment\n  }\n}": types.FormDataByFormLinkNameDocument,
    "query FormDataByUserId($userId: String!, $before: String, $after: String, $first: Float, $last: Float) {\n  formDataByUserId(\n    userId: $userId\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n  ) {\n    edges {\n      cursor\n      node {\n        ...formDataFragment\n      }\n    }\n  }\n}": types.FormDataByUserIdDocument,
    "query GetAllFormData($isDeleted: Boolean, $before: String, $after: String, $first: Float, $last: Float) {\n  getAllFormData(\n    isDeleted: $isDeleted\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n  ) {\n    edges {\n      cursor\n      node {\n        ...formDataFragment\n        submissions {\n          ...formSubmissionFragment\n        }\n        user {\n          ...userFragment\n        }\n      }\n    }\n  }\n}": types.GetAllFormDataDocument,
    "query GetTemplateByFormId($formId: String!) {\n  getTemplateByFormId(formId: $formId) {\n    ...formDataFragment\n  }\n}": types.GetTemplateByFormIdDocument,
    "query MyFormData($isDeleted: Boolean = false, $before: String, $after: String, $last: Float, $first: Float) {\n  myFormData(\n    isDeleted: $isDeleted\n    before: $before\n    after: $after\n    last: $last\n    first: $first\n  ) {\n    edges {\n      cursor\n      node {\n        ...formDataFragment\n      }\n    }\n  }\n}": types.MyFormDataDocument,
    "fragment documentFragment on Document {\n  id\n  formId\n  formAlternateId\n  url\n  isPdf\n  type\n  isDeleted\n}": types.DocumentFragmentFragmentDoc,
    "mutation RemoveFormDocument($documentId: Float!) {\n  removeFormDocument(documentId: $documentId) {\n    ...documentFragment\n  }\n}": types.RemoveFormDocumentDocument,
    "mutation UpdateFormDocument($input: [DocumentInput!]!) {\n  updateFormDocument(input: $input) {\n    ...documentFragment\n  }\n}": types.UpdateFormDocumentDocument,
    "query GetFileByFormId($formId: String!) {\n  getFileByFormId(formId: $formId) {\n    ...documentFragment\n  }\n}": types.GetFileByFormIdDocument,
    "query GetFilesByFormId($formId: String!, $before: String, $after: String, $first: Float, $last: Float) {\n  getFilesByFormId(\n    formId: $formId\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n  ) {\n    edges {\n      cursor\n      node {\n        ...documentFragment\n      }\n    }\n  }\n}": types.GetFilesByFormIdDocument,
    "fragment profileFragment on Profile {\n  id\n  userId\n  firstName\n  lastName\n  dob\n  gender\n  phone\n  alternatePhone\n  email\n  alternateEmail\n  profileType\n  currentAddressLineOne\n  currentAddressLineTwo\n  currentZipCode\n  addressLineOne\n  addressLineTwo\n  zipCode\n  careOfName\n  careOfContact\n  careOfType\n}": types.ProfileFragmentFragmentDoc,
    "mutation SavePersonalInformation($input: SavePersonalInfoInput!) {\n  savePersonalInformation(input: $input) {\n    ...profileFragment\n  }\n}": types.SavePersonalInformationDocument,
    "query MyPersonalInfo {\n  myPersonalInfo {\n    ...profileFragment\n    country {\n      ...countriesFragment\n    }\n    currentCountry {\n      ...countriesFragment\n    }\n    state {\n      ...stateFragment\n    }\n    currentState {\n      ...stateFragment\n    }\n    city {\n      ...cityFragment\n    }\n    currentCity {\n      ...cityFragment\n    }\n  }\n}": types.MyPersonalInfoDocument,
    "query ProfileById($profileId: String!) {\n  profileById(profileId: $profileId) {\n    ...profileFragment\n    country {\n      ...countriesFragment\n    }\n    currentCountry {\n      ...countriesFragment\n    }\n    state {\n      ...stateFragment\n    }\n    currentState {\n      ...stateFragment\n    }\n    city {\n      ...cityFragment\n    }\n    currentCity {\n      ...cityFragment\n    }\n    educations {\n      ...educationFragment\n    }\n    workExperience {\n      ...workExperience\n    }\n    candidateSkills {\n      ...candidateSkill\n    }\n    additionalInfo {\n      ...additionalInfo\n    }\n    questionaireAnswer {\n      ...questionaireAns\n      question {\n        ...question\n      }\n    }\n  }\n}": types.ProfileByIdDocument,
    "fragment questionaireAns on QuestionaireAnswer {\n  id\n  profileId\n  questionId\n  answer\n}": types.QuestionaireAnsFragmentDoc,
    "mutation SaveQuestionaireAnswer($questions: [SaveQuestionaireAnsInput!]!) {\n  saveQuestionaireAnswer(questions: $questions) {\n    ...questionaireAns\n  }\n}": types.SaveQuestionaireAnswerDocument,
    "query QuestionaireAns($before: String, $after: String, $first: Float, $last: Float) {\n  questionaireAns(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      cursor\n      node {\n        ...questionaireAns\n        question {\n          ...question\n        }\n      }\n    }\n  }\n}": types.QuestionaireAnsDocument,
    "fragment question on Question {\n  id\n  text\n}": types.QuestionFragmentDoc,
    "query Questions($before: String, $after: String, $last: Float, $first: Float) {\n  questions(before: $before, after: $after, last: $last, first: $first) {\n    edges {\n      node {\n        ...question\n      }\n      cursor\n    }\n  }\n}": types.QuestionsDocument,
    "fragment stateFragment on State {\n  id\n  name\n  stateCode\n  countryId\n  latitude\n  longitude\n  type\n}": types.StateFragmentFragmentDoc,
    "query States($before: String, $after: String, $first: Float, $last: Float, $countryId: Float) {\n  states(\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n    countryId: $countryId\n  ) {\n    edges {\n      cursor\n      node {\n        ...stateFragment\n      }\n    }\n  }\n}": types.StatesDocument,
    "fragment formSubmissionFragment on Submission {\n  id\n  formId\n  jsonData\n  formAlternateId\n}": types.FormSubmissionFragmentFragmentDoc,
    "mutation AddFormSubmission($input: SubmissionInput!) {\n  addFormSubmission(input: $input) {\n    ...formSubmissionFragment\n  }\n}": types.AddFormSubmissionDocument,
    "query GetFormSubmission($before: String, $after: String, $first: Float, $last: Float) {\n  getFormSubmission(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      node {\n        ...formSubmissionFragment\n      }\n      cursor\n    }\n  }\n}": types.GetFormSubmissionDocument,
    "query GetFormSubmissionByFormId($formId: Float!, $before: String, $after: String, $first: Float, $last: Float) {\n  getFormSubmissionByFormId(\n    formId: $formId\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n  ) {\n    edges {\n      cursor\n      node {\n        ...formSubmissionFragment\n      }\n    }\n  }\n}": types.GetFormSubmissionByFormIdDocument,
    "query Upload_getSignedUrl($input: UploadInput!) {\n  upload_getSignedUrl(input: $input)\n}": types.Upload_GetSignedUrlDocument,
    "fragment userFragment on User {\n  id\n  name\n  firstName\n  lastName\n  email\n  organisationName\n  accessType\n}": types.UserFragmentFragmentDoc,
    "mutation RegisterCompanyAdmin($input: CompanyAdminInput!) {\n  registerCompanyAdmin(input: $input) {\n    ...userFragment\n  }\n}": types.RegisterCompanyAdminDocument,
    "mutation RegisterUser($input: UserInput!) {\n  registerUser(input: $input) {\n    ...userFragment\n  }\n}": types.RegisterUserDocument,
    "query Viewer {\n  viewer {\n    expires\n    user {\n      ...userFragment\n      profile {\n        ...profileFragment\n        country {\n          ...countriesFragment\n        }\n        currentCountry {\n          ...countriesFragment\n        }\n        state {\n          ...stateFragment\n        }\n        currentState {\n          ...stateFragment\n        }\n        city {\n          ...cityFragment\n        }\n        currentCity {\n          ...cityFragment\n        }\n      }\n    }\n  }\n}": types.ViewerDocument,
    "fragment workExperience on WorkExperience {\n  id\n  profileId\n  title\n  employmentType\n  companyName\n  location\n  locationType\n  startDate\n  endDate\n  description\n  isDeleted\n}": types.WorkExperienceFragmentDoc,
    "mutation RemoveWorkExperienceById($workExperienceId: Float!) {\n  removeWorkExperienceById(workExperienceId: $workExperienceId) {\n    ...workExperience\n    assets {\n      ...asset\n    }\n  }\n}": types.RemoveWorkExperienceByIdDocument,
    "mutation SaveWorkExperience($input: SaveWorkExperienceInput!) {\n  saveWorkExperience(input: $input) {\n    ...workExperience\n    assets {\n      ...asset\n    }\n  }\n}": types.SaveWorkExperienceDocument,
    "mutation UpdateWorkExperienceById($input: SaveWorkExperienceInput!, $workExperienceId: Float!) {\n  updateWorkExperienceById(input: $input, workExperienceId: $workExperienceId) {\n    ...workExperience\n    assets {\n      ...asset\n    }\n  }\n}": types.UpdateWorkExperienceByIdDocument,
    "query GetWorkExperienceById($workExperienceId: Float!) {\n  getWorkExperienceById(workExperienceId: $workExperienceId) {\n    ...workExperience\n    assets {\n      ...asset\n    }\n  }\n}": types.GetWorkExperienceByIdDocument,
    "query MyWorkExperience($before: String, $after: String, $first: Float, $last: Float) {\n  myWorkExperience(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      cursor\n      node {\n        ...workExperience\n        assets {\n          ...asset\n        }\n      }\n    }\n  }\n}": types.MyWorkExperienceDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment pageInfoFragment on PageInfo {\n  endCursor\n  hasNextPage\n  hasPreviousPage\n  startCursor\n}"): (typeof documents)["fragment pageInfoFragment on PageInfo {\n  endCursor\n  hasNextPage\n  hasPreviousPage\n  startCursor\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment achievementAward on AchievementAward {\n  id\n  title\n  profileId\n  associatedWith\n  issuer\n  issuerDate\n  description\n  isDeleted\n}"): (typeof documents)["fragment achievementAward on AchievementAward {\n  id\n  title\n  profileId\n  associatedWith\n  issuer\n  issuerDate\n  description\n  isDeleted\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RemoveAchievementAwardById($achievementAwardId: Float!) {\n  removeAchievementAwardById(achievementAwardId: $achievementAwardId) {\n    ...achievementAward\n    assets {\n      ...asset\n    }\n  }\n}"): (typeof documents)["mutation RemoveAchievementAwardById($achievementAwardId: Float!) {\n  removeAchievementAwardById(achievementAwardId: $achievementAwardId) {\n    ...achievementAward\n    assets {\n      ...asset\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SaveAchievementAward($input: SaveAchievementAwardInput!) {\n  saveAchievementAward(input: $input) {\n    ...achievementAward\n    assets {\n      ...asset\n    }\n  }\n}"): (typeof documents)["mutation SaveAchievementAward($input: SaveAchievementAwardInput!) {\n  saveAchievementAward(input: $input) {\n    ...achievementAward\n    assets {\n      ...asset\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateAchievementAwardById($input: SaveAchievementAwardInput!, $achievementAwardId: Float!) {\n  updateAchievementAwardById(\n    input: $input\n    achievementAwardId: $achievementAwardId\n  ) {\n    ...achievementAward\n    assets {\n      ...asset\n    }\n  }\n}"): (typeof documents)["mutation UpdateAchievementAwardById($input: SaveAchievementAwardInput!, $achievementAwardId: Float!) {\n  updateAchievementAwardById(\n    input: $input\n    achievementAwardId: $achievementAwardId\n  ) {\n    ...achievementAward\n    assets {\n      ...asset\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query AchievementAwards($before: String, $after: String, $first: Float, $last: Float) {\n  achievementAwards(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      cursor\n      node {\n        ...achievementAward\n        assets {\n          ...asset\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query AchievementAwards($before: String, $after: String, $first: Float, $last: Float) {\n  achievementAwards(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      cursor\n      node {\n        ...achievementAward\n        assets {\n          ...asset\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetAwardById($awardId: Float!) {\n  getAwardById(awardId: $awardId) {\n    ...achievementAward\n    assets {\n      ...asset\n    }\n  }\n}"): (typeof documents)["query GetAwardById($awardId: Float!) {\n  getAwardById(awardId: $awardId) {\n    ...achievementAward\n    assets {\n      ...asset\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment additionalInfo on AdditionalInfo {\n  id\n  profileId\n  coveringLetter\n  statementOfPurpose\n}"): (typeof documents)["fragment additionalInfo on AdditionalInfo {\n  id\n  profileId\n  coveringLetter\n  statementOfPurpose\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SaveAdditonalInfo($input: SaveAdditionalInfoInput!) {\n  saveAdditonalInfo(input: $input) {\n    ...additionalInfo\n  }\n}"): (typeof documents)["mutation SaveAdditonalInfo($input: SaveAdditionalInfoInput!) {\n  saveAdditonalInfo(input: $input) {\n    ...additionalInfo\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query AddionalInfo {\n  addionalInfo {\n    id\n    profileId\n    coveringLetter\n    statementOfPurpose\n  }\n}"): (typeof documents)["query AddionalInfo {\n  addionalInfo {\n    id\n    profileId\n    coveringLetter\n    statementOfPurpose\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment asset on Asset {\n  id\n  name\n  url\n  fileType\n  type\n  desc\n  isDeleted\n}"): (typeof documents)["fragment asset on Asset {\n  id\n  name\n  url\n  fileType\n  type\n  desc\n  isDeleted\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RemoveAssetByAchievementAwardById($achievementAwardId: Float!) {\n  removeAssetByAchievementAwardById(achievementAwardId: $achievementAwardId) {\n    ...asset\n  }\n}"): (typeof documents)["mutation RemoveAssetByAchievementAwardById($achievementAwardId: Float!) {\n  removeAssetByAchievementAwardById(achievementAwardId: $achievementAwardId) {\n    ...asset\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RemoveAssetByWorkExperienceById($workExperienceId: Float!) {\n  removeAssetByWorkExperienceById(workExperienceId: $workExperienceId) {\n    ...asset\n  }\n}"): (typeof documents)["mutation RemoveAssetByWorkExperienceById($workExperienceId: Float!) {\n  removeAssetByWorkExperienceById(workExperienceId: $workExperienceId) {\n    ...asset\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ChangePassword($input: ChangePasswordInput!) {\n  changePassword(input: $input) {\n    ...userFragment\n  }\n}"): (typeof documents)["mutation ChangePassword($input: ChangePasswordInput!) {\n  changePassword(input: $input) {\n    ...userFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreatePassword($input: CreatePasswordInput!) {\n  createPassword(input: $input) {\n    ...userFragment\n  }\n}"): (typeof documents)["mutation CreatePassword($input: CreatePasswordInput!) {\n  createPassword(input: $input) {\n    ...userFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ResetPassword($input: ResetPasswordInput!) {\n  resetPassword(input: $input)\n}"): (typeof documents)["mutation ResetPassword($input: ResetPasswordInput!) {\n  resetPassword(input: $input)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SendForgetPassLink($email: String!) {\n  sendForgetPassLink(email: $email)\n}"): (typeof documents)["mutation SendForgetPassLink($email: String!) {\n  sendForgetPassLink(email: $email)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment candidateSkill on CandidateSkill {\n  id\n  name\n  profileId\n  workExperience\n  internship\n  isDeleted\n  recordedBy\n  lastModifiedBy\n}"): (typeof documents)["fragment candidateSkill on CandidateSkill {\n  id\n  name\n  profileId\n  workExperience\n  internship\n  isDeleted\n  recordedBy\n  lastModifiedBy\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RemoveCandidateSkill($candidateSkillId: Float!) {\n  removecandidateSkill(candidateSkillId: $candidateSkillId) {\n    ...candidateSkill\n  }\n}"): (typeof documents)["mutation RemoveCandidateSkill($candidateSkillId: Float!) {\n  removecandidateSkill(candidateSkillId: $candidateSkillId) {\n    ...candidateSkill\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SaveCandidateSkill($input: SaveCandidateSkillsInput!) {\n  saveCandidateSkill(input: $input) {\n    ...candidateSkill\n  }\n}"): (typeof documents)["mutation SaveCandidateSkill($input: SaveCandidateSkillsInput!) {\n  saveCandidateSkill(input: $input) {\n    ...candidateSkill\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateCandidateSkillById($input: SaveCandidateSkillsInput!, $candidateSkillId: Float!) {\n  updateCandidateSkillById(input: $input, candidateSkillId: $candidateSkillId) {\n    ...candidateSkill\n  }\n}"): (typeof documents)["mutation UpdateCandidateSkillById($input: SaveCandidateSkillsInput!, $candidateSkillId: Float!) {\n  updateCandidateSkillById(input: $input, candidateSkillId: $candidateSkillId) {\n    ...candidateSkill\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query CandidateSkills($before: String, $after: String, $first: Float, $last: Float) {\n  candidateSkills(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      cursor\n      node {\n        ...candidateSkill\n      }\n    }\n  }\n}"): (typeof documents)["query CandidateSkills($before: String, $after: String, $first: Float, $last: Float) {\n  candidateSkills(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      cursor\n      node {\n        ...candidateSkill\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetcandidateSkillById($candidateSkillId: Float!) {\n  getcandidateSkillById(candidateSkillId: $candidateSkillId) {\n    ...candidateSkill\n  }\n}"): (typeof documents)["query GetcandidateSkillById($candidateSkillId: Float!) {\n  getcandidateSkillById(candidateSkillId: $candidateSkillId) {\n    ...candidateSkill\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment cityFragment on City {\n  id\n  stateId\n  name\n  wikiDataId\n  latitude\n  longitude\n}"): (typeof documents)["fragment cityFragment on City {\n  id\n  stateId\n  name\n  wikiDataId\n  latitude\n  longitude\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Cities($before: String, $after: String, $first: Float, $last: Float, $stateId: Float) {\n  cities(\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n    stateId: $stateId\n  ) {\n    edges {\n      cursor\n      node {\n        ...cityFragment\n      }\n    }\n  }\n}"): (typeof documents)["query Cities($before: String, $after: String, $first: Float, $last: Float, $stateId: Float) {\n  cities(\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n    stateId: $stateId\n  ) {\n    edges {\n      cursor\n      node {\n        ...cityFragment\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment countriesFragment on Country {\n  id\n  capital\n  currency\n  currencyName\n  currencySymbol\n  emoji\n  emojiU\n  iso2\n  iso3\n  latitude\n  longitude\n  name\n  nationality\n  numericCode\n  phoneCode\n  regionName\n  subregionName\n}"): (typeof documents)["fragment countriesFragment on Country {\n  id\n  capital\n  currency\n  currencyName\n  currencySymbol\n  emoji\n  emojiU\n  iso2\n  iso3\n  latitude\n  longitude\n  name\n  nationality\n  numericCode\n  phoneCode\n  regionName\n  subregionName\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Countries($before: String, $after: String, $first: Float, $last: Float) {\n  countries(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      node {\n        ...countriesFragment\n      }\n    }\n  }\n}"): (typeof documents)["query Countries($before: String, $after: String, $first: Float, $last: Float) {\n  countries(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      node {\n        ...countriesFragment\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment educationFragment on Education {\n  id\n  profileId\n  startDate\n  endDate\n  fieldOfStudy\n  degree\n  college\n  grade\n  activitiesAndSocities\n  isDeleted\n}"): (typeof documents)["fragment educationFragment on Education {\n  id\n  profileId\n  startDate\n  endDate\n  fieldOfStudy\n  degree\n  college\n  grade\n  activitiesAndSocities\n  isDeleted\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RemoveEducationAndQualification($educationId: Float!) {\n  removeEducationAndQualification(educationId: $educationId) {\n    ...educationFragment\n  }\n}"): (typeof documents)["mutation RemoveEducationAndQualification($educationId: Float!) {\n  removeEducationAndQualification(educationId: $educationId) {\n    ...educationFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SaveEducationAndQualification($input: SaveEducationInput!) {\n  saveEducationAndQualification(input: $input) {\n    ...educationFragment\n  }\n}"): (typeof documents)["mutation SaveEducationAndQualification($input: SaveEducationInput!) {\n  saveEducationAndQualification(input: $input) {\n    ...educationFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateEducationById($input: SaveEducationInput!, $educationId: Float!) {\n  updateEducationById(input: $input, educationId: $educationId) {\n    ...educationFragment\n  }\n}"): (typeof documents)["mutation UpdateEducationById($input: SaveEducationInput!, $educationId: Float!) {\n  updateEducationById(input: $input, educationId: $educationId) {\n    ...educationFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetEducationById($educationId: Float!) {\n  getEducationById(educationId: $educationId) {\n    ...educationFragment\n  }\n}"): (typeof documents)["query GetEducationById($educationId: Float!) {\n  getEducationById(educationId: $educationId) {\n    ...educationFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Educations($before: String, $after: String, $first: Float, $last: Float) {\n  educations(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      cursor\n      node {\n        ...educationFragment\n      }\n    }\n  }\n}"): (typeof documents)["query Educations($before: String, $after: String, $first: Float, $last: Float) {\n  educations(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      cursor\n      node {\n        ...educationFragment\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment formDataFragment on FormData {\n  id\n  userId\n  alternateFormId\n  templateRow\n  isPublished\n  isDeleted\n  createdAt\n  formLinkName\n  formLinkDesc\n}"): (typeof documents)["fragment formDataFragment on FormData {\n  id\n  userId\n  alternateFormId\n  templateRow\n  isPublished\n  isDeleted\n  createdAt\n  formLinkName\n  formLinkDesc\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AddFormData($input: FormDataInput!) {\n  addFormData(input: $input) {\n    ...formDataFragment\n  }\n}"): (typeof documents)["mutation AddFormData($input: FormDataInput!) {\n  addFormData(input: $input) {\n    ...formDataFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AddLinkNameData($input: LinkNameFormData!) {\n  addLinkNameData(input: $input) {\n    ...formDataFragment\n  }\n}"): (typeof documents)["mutation AddLinkNameData($input: LinkNameFormData!) {\n  addLinkNameData(input: $input) {\n    ...formDataFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteFormData($input: DeleteFormDataInput!) {\n  deleteFormData(input: $input) {\n    ...formDataFragment\n  }\n}"): (typeof documents)["mutation DeleteFormData($input: DeleteFormDataInput!) {\n  deleteFormData(input: $input) {\n    ...formDataFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation PublishFormData($input: PulishFormDataInput!) {\n  publishFormData(input: $input) {\n    ...formDataFragment\n  }\n}"): (typeof documents)["mutation PublishFormData($input: PulishFormDataInput!) {\n  publishFormData(input: $input) {\n    ...formDataFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateFormData($input: UpdateFormDataInput!) {\n  updateFormData(input: $input) {\n    ...formDataFragment\n  }\n}"): (typeof documents)["mutation UpdateFormData($input: UpdateFormDataInput!) {\n  updateFormData(input: $input) {\n    ...formDataFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FormDataByFormId($formId: String!) {\n  formDataByFormId(formId: $formId) {\n    ...formDataFragment\n  }\n}"): (typeof documents)["query FormDataByFormId($formId: String!) {\n  formDataByFormId(formId: $formId) {\n    ...formDataFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FormDataByFormLinkName($formLinkName: String!) {\n  formDataByFormLinkName(formLinkName: $formLinkName) {\n    ...formDataFragment\n  }\n}"): (typeof documents)["query FormDataByFormLinkName($formLinkName: String!) {\n  formDataByFormLinkName(formLinkName: $formLinkName) {\n    ...formDataFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FormDataByUserId($userId: String!, $before: String, $after: String, $first: Float, $last: Float) {\n  formDataByUserId(\n    userId: $userId\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n  ) {\n    edges {\n      cursor\n      node {\n        ...formDataFragment\n      }\n    }\n  }\n}"): (typeof documents)["query FormDataByUserId($userId: String!, $before: String, $after: String, $first: Float, $last: Float) {\n  formDataByUserId(\n    userId: $userId\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n  ) {\n    edges {\n      cursor\n      node {\n        ...formDataFragment\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetAllFormData($isDeleted: Boolean, $before: String, $after: String, $first: Float, $last: Float) {\n  getAllFormData(\n    isDeleted: $isDeleted\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n  ) {\n    edges {\n      cursor\n      node {\n        ...formDataFragment\n        submissions {\n          ...formSubmissionFragment\n        }\n        user {\n          ...userFragment\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query GetAllFormData($isDeleted: Boolean, $before: String, $after: String, $first: Float, $last: Float) {\n  getAllFormData(\n    isDeleted: $isDeleted\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n  ) {\n    edges {\n      cursor\n      node {\n        ...formDataFragment\n        submissions {\n          ...formSubmissionFragment\n        }\n        user {\n          ...userFragment\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetTemplateByFormId($formId: String!) {\n  getTemplateByFormId(formId: $formId) {\n    ...formDataFragment\n  }\n}"): (typeof documents)["query GetTemplateByFormId($formId: String!) {\n  getTemplateByFormId(formId: $formId) {\n    ...formDataFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyFormData($isDeleted: Boolean = false, $before: String, $after: String, $last: Float, $first: Float) {\n  myFormData(\n    isDeleted: $isDeleted\n    before: $before\n    after: $after\n    last: $last\n    first: $first\n  ) {\n    edges {\n      cursor\n      node {\n        ...formDataFragment\n      }\n    }\n  }\n}"): (typeof documents)["query MyFormData($isDeleted: Boolean = false, $before: String, $after: String, $last: Float, $first: Float) {\n  myFormData(\n    isDeleted: $isDeleted\n    before: $before\n    after: $after\n    last: $last\n    first: $first\n  ) {\n    edges {\n      cursor\n      node {\n        ...formDataFragment\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment documentFragment on Document {\n  id\n  formId\n  formAlternateId\n  url\n  isPdf\n  type\n  isDeleted\n}"): (typeof documents)["fragment documentFragment on Document {\n  id\n  formId\n  formAlternateId\n  url\n  isPdf\n  type\n  isDeleted\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RemoveFormDocument($documentId: Float!) {\n  removeFormDocument(documentId: $documentId) {\n    ...documentFragment\n  }\n}"): (typeof documents)["mutation RemoveFormDocument($documentId: Float!) {\n  removeFormDocument(documentId: $documentId) {\n    ...documentFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateFormDocument($input: [DocumentInput!]!) {\n  updateFormDocument(input: $input) {\n    ...documentFragment\n  }\n}"): (typeof documents)["mutation UpdateFormDocument($input: [DocumentInput!]!) {\n  updateFormDocument(input: $input) {\n    ...documentFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFileByFormId($formId: String!) {\n  getFileByFormId(formId: $formId) {\n    ...documentFragment\n  }\n}"): (typeof documents)["query GetFileByFormId($formId: String!) {\n  getFileByFormId(formId: $formId) {\n    ...documentFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFilesByFormId($formId: String!, $before: String, $after: String, $first: Float, $last: Float) {\n  getFilesByFormId(\n    formId: $formId\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n  ) {\n    edges {\n      cursor\n      node {\n        ...documentFragment\n      }\n    }\n  }\n}"): (typeof documents)["query GetFilesByFormId($formId: String!, $before: String, $after: String, $first: Float, $last: Float) {\n  getFilesByFormId(\n    formId: $formId\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n  ) {\n    edges {\n      cursor\n      node {\n        ...documentFragment\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment profileFragment on Profile {\n  id\n  userId\n  firstName\n  lastName\n  dob\n  gender\n  phone\n  alternatePhone\n  email\n  alternateEmail\n  profileType\n  currentAddressLineOne\n  currentAddressLineTwo\n  currentZipCode\n  addressLineOne\n  addressLineTwo\n  zipCode\n  careOfName\n  careOfContact\n  careOfType\n}"): (typeof documents)["fragment profileFragment on Profile {\n  id\n  userId\n  firstName\n  lastName\n  dob\n  gender\n  phone\n  alternatePhone\n  email\n  alternateEmail\n  profileType\n  currentAddressLineOne\n  currentAddressLineTwo\n  currentZipCode\n  addressLineOne\n  addressLineTwo\n  zipCode\n  careOfName\n  careOfContact\n  careOfType\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SavePersonalInformation($input: SavePersonalInfoInput!) {\n  savePersonalInformation(input: $input) {\n    ...profileFragment\n  }\n}"): (typeof documents)["mutation SavePersonalInformation($input: SavePersonalInfoInput!) {\n  savePersonalInformation(input: $input) {\n    ...profileFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyPersonalInfo {\n  myPersonalInfo {\n    ...profileFragment\n    country {\n      ...countriesFragment\n    }\n    currentCountry {\n      ...countriesFragment\n    }\n    state {\n      ...stateFragment\n    }\n    currentState {\n      ...stateFragment\n    }\n    city {\n      ...cityFragment\n    }\n    currentCity {\n      ...cityFragment\n    }\n  }\n}"): (typeof documents)["query MyPersonalInfo {\n  myPersonalInfo {\n    ...profileFragment\n    country {\n      ...countriesFragment\n    }\n    currentCountry {\n      ...countriesFragment\n    }\n    state {\n      ...stateFragment\n    }\n    currentState {\n      ...stateFragment\n    }\n    city {\n      ...cityFragment\n    }\n    currentCity {\n      ...cityFragment\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ProfileById($profileId: String!) {\n  profileById(profileId: $profileId) {\n    ...profileFragment\n    country {\n      ...countriesFragment\n    }\n    currentCountry {\n      ...countriesFragment\n    }\n    state {\n      ...stateFragment\n    }\n    currentState {\n      ...stateFragment\n    }\n    city {\n      ...cityFragment\n    }\n    currentCity {\n      ...cityFragment\n    }\n    educations {\n      ...educationFragment\n    }\n    workExperience {\n      ...workExperience\n    }\n    candidateSkills {\n      ...candidateSkill\n    }\n    additionalInfo {\n      ...additionalInfo\n    }\n    questionaireAnswer {\n      ...questionaireAns\n      question {\n        ...question\n      }\n    }\n  }\n}"): (typeof documents)["query ProfileById($profileId: String!) {\n  profileById(profileId: $profileId) {\n    ...profileFragment\n    country {\n      ...countriesFragment\n    }\n    currentCountry {\n      ...countriesFragment\n    }\n    state {\n      ...stateFragment\n    }\n    currentState {\n      ...stateFragment\n    }\n    city {\n      ...cityFragment\n    }\n    currentCity {\n      ...cityFragment\n    }\n    educations {\n      ...educationFragment\n    }\n    workExperience {\n      ...workExperience\n    }\n    candidateSkills {\n      ...candidateSkill\n    }\n    additionalInfo {\n      ...additionalInfo\n    }\n    questionaireAnswer {\n      ...questionaireAns\n      question {\n        ...question\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment questionaireAns on QuestionaireAnswer {\n  id\n  profileId\n  questionId\n  answer\n}"): (typeof documents)["fragment questionaireAns on QuestionaireAnswer {\n  id\n  profileId\n  questionId\n  answer\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SaveQuestionaireAnswer($questions: [SaveQuestionaireAnsInput!]!) {\n  saveQuestionaireAnswer(questions: $questions) {\n    ...questionaireAns\n  }\n}"): (typeof documents)["mutation SaveQuestionaireAnswer($questions: [SaveQuestionaireAnsInput!]!) {\n  saveQuestionaireAnswer(questions: $questions) {\n    ...questionaireAns\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query QuestionaireAns($before: String, $after: String, $first: Float, $last: Float) {\n  questionaireAns(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      cursor\n      node {\n        ...questionaireAns\n        question {\n          ...question\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query QuestionaireAns($before: String, $after: String, $first: Float, $last: Float) {\n  questionaireAns(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      cursor\n      node {\n        ...questionaireAns\n        question {\n          ...question\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment question on Question {\n  id\n  text\n}"): (typeof documents)["fragment question on Question {\n  id\n  text\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Questions($before: String, $after: String, $last: Float, $first: Float) {\n  questions(before: $before, after: $after, last: $last, first: $first) {\n    edges {\n      node {\n        ...question\n      }\n      cursor\n    }\n  }\n}"): (typeof documents)["query Questions($before: String, $after: String, $last: Float, $first: Float) {\n  questions(before: $before, after: $after, last: $last, first: $first) {\n    edges {\n      node {\n        ...question\n      }\n      cursor\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment stateFragment on State {\n  id\n  name\n  stateCode\n  countryId\n  latitude\n  longitude\n  type\n}"): (typeof documents)["fragment stateFragment on State {\n  id\n  name\n  stateCode\n  countryId\n  latitude\n  longitude\n  type\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query States($before: String, $after: String, $first: Float, $last: Float, $countryId: Float) {\n  states(\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n    countryId: $countryId\n  ) {\n    edges {\n      cursor\n      node {\n        ...stateFragment\n      }\n    }\n  }\n}"): (typeof documents)["query States($before: String, $after: String, $first: Float, $last: Float, $countryId: Float) {\n  states(\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n    countryId: $countryId\n  ) {\n    edges {\n      cursor\n      node {\n        ...stateFragment\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment formSubmissionFragment on Submission {\n  id\n  formId\n  jsonData\n  formAlternateId\n}"): (typeof documents)["fragment formSubmissionFragment on Submission {\n  id\n  formId\n  jsonData\n  formAlternateId\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AddFormSubmission($input: SubmissionInput!) {\n  addFormSubmission(input: $input) {\n    ...formSubmissionFragment\n  }\n}"): (typeof documents)["mutation AddFormSubmission($input: SubmissionInput!) {\n  addFormSubmission(input: $input) {\n    ...formSubmissionFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFormSubmission($before: String, $after: String, $first: Float, $last: Float) {\n  getFormSubmission(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      node {\n        ...formSubmissionFragment\n      }\n      cursor\n    }\n  }\n}"): (typeof documents)["query GetFormSubmission($before: String, $after: String, $first: Float, $last: Float) {\n  getFormSubmission(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      node {\n        ...formSubmissionFragment\n      }\n      cursor\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFormSubmissionByFormId($formId: Float!, $before: String, $after: String, $first: Float, $last: Float) {\n  getFormSubmissionByFormId(\n    formId: $formId\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n  ) {\n    edges {\n      cursor\n      node {\n        ...formSubmissionFragment\n      }\n    }\n  }\n}"): (typeof documents)["query GetFormSubmissionByFormId($formId: Float!, $before: String, $after: String, $first: Float, $last: Float) {\n  getFormSubmissionByFormId(\n    formId: $formId\n    before: $before\n    after: $after\n    first: $first\n    last: $last\n  ) {\n    edges {\n      cursor\n      node {\n        ...formSubmissionFragment\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Upload_getSignedUrl($input: UploadInput!) {\n  upload_getSignedUrl(input: $input)\n}"): (typeof documents)["query Upload_getSignedUrl($input: UploadInput!) {\n  upload_getSignedUrl(input: $input)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment userFragment on User {\n  id\n  name\n  firstName\n  lastName\n  email\n  organisationName\n  accessType\n}"): (typeof documents)["fragment userFragment on User {\n  id\n  name\n  firstName\n  lastName\n  email\n  organisationName\n  accessType\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RegisterCompanyAdmin($input: CompanyAdminInput!) {\n  registerCompanyAdmin(input: $input) {\n    ...userFragment\n  }\n}"): (typeof documents)["mutation RegisterCompanyAdmin($input: CompanyAdminInput!) {\n  registerCompanyAdmin(input: $input) {\n    ...userFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RegisterUser($input: UserInput!) {\n  registerUser(input: $input) {\n    ...userFragment\n  }\n}"): (typeof documents)["mutation RegisterUser($input: UserInput!) {\n  registerUser(input: $input) {\n    ...userFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Viewer {\n  viewer {\n    expires\n    user {\n      ...userFragment\n      profile {\n        ...profileFragment\n        country {\n          ...countriesFragment\n        }\n        currentCountry {\n          ...countriesFragment\n        }\n        state {\n          ...stateFragment\n        }\n        currentState {\n          ...stateFragment\n        }\n        city {\n          ...cityFragment\n        }\n        currentCity {\n          ...cityFragment\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query Viewer {\n  viewer {\n    expires\n    user {\n      ...userFragment\n      profile {\n        ...profileFragment\n        country {\n          ...countriesFragment\n        }\n        currentCountry {\n          ...countriesFragment\n        }\n        state {\n          ...stateFragment\n        }\n        currentState {\n          ...stateFragment\n        }\n        city {\n          ...cityFragment\n        }\n        currentCity {\n          ...cityFragment\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment workExperience on WorkExperience {\n  id\n  profileId\n  title\n  employmentType\n  companyName\n  location\n  locationType\n  startDate\n  endDate\n  description\n  isDeleted\n}"): (typeof documents)["fragment workExperience on WorkExperience {\n  id\n  profileId\n  title\n  employmentType\n  companyName\n  location\n  locationType\n  startDate\n  endDate\n  description\n  isDeleted\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RemoveWorkExperienceById($workExperienceId: Float!) {\n  removeWorkExperienceById(workExperienceId: $workExperienceId) {\n    ...workExperience\n    assets {\n      ...asset\n    }\n  }\n}"): (typeof documents)["mutation RemoveWorkExperienceById($workExperienceId: Float!) {\n  removeWorkExperienceById(workExperienceId: $workExperienceId) {\n    ...workExperience\n    assets {\n      ...asset\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SaveWorkExperience($input: SaveWorkExperienceInput!) {\n  saveWorkExperience(input: $input) {\n    ...workExperience\n    assets {\n      ...asset\n    }\n  }\n}"): (typeof documents)["mutation SaveWorkExperience($input: SaveWorkExperienceInput!) {\n  saveWorkExperience(input: $input) {\n    ...workExperience\n    assets {\n      ...asset\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateWorkExperienceById($input: SaveWorkExperienceInput!, $workExperienceId: Float!) {\n  updateWorkExperienceById(input: $input, workExperienceId: $workExperienceId) {\n    ...workExperience\n    assets {\n      ...asset\n    }\n  }\n}"): (typeof documents)["mutation UpdateWorkExperienceById($input: SaveWorkExperienceInput!, $workExperienceId: Float!) {\n  updateWorkExperienceById(input: $input, workExperienceId: $workExperienceId) {\n    ...workExperience\n    assets {\n      ...asset\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetWorkExperienceById($workExperienceId: Float!) {\n  getWorkExperienceById(workExperienceId: $workExperienceId) {\n    ...workExperience\n    assets {\n      ...asset\n    }\n  }\n}"): (typeof documents)["query GetWorkExperienceById($workExperienceId: Float!) {\n  getWorkExperienceById(workExperienceId: $workExperienceId) {\n    ...workExperience\n    assets {\n      ...asset\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyWorkExperience($before: String, $after: String, $first: Float, $last: Float) {\n  myWorkExperience(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      cursor\n      node {\n        ...workExperience\n        assets {\n          ...asset\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query MyWorkExperience($before: String, $after: String, $first: Float, $last: Float) {\n  myWorkExperience(before: $before, after: $after, first: $first, last: $last) {\n    edges {\n      cursor\n      node {\n        ...workExperience\n        assets {\n          ...asset\n        }\n      }\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;