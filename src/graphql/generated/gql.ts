/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation SignIn($signInInput: SignInInput!) {\n    signin(signInInput: $signInInput) {\n      isSignedIn\n      accessToken\n      refreshToken\n    }\n  }\n": typeof types.SignInDocument,
    "\n  mutation LogOut {\n    logOut {\n      message\n    }\n  }\n": typeof types.LogOutDocument,
    "\n  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {\n    createCategory(createCategoryInput: $createCategoryInput) {\n      slug\n      name\n    }\n  }\n": typeof types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($updateCategoryInput: UpdateCategoryInput!) {\n  updateCategory(updateCategoryInput: $updateCategoryInput) {\n    id\n    name\n    description\n    slug\n  }\n}\n": typeof types.UpdateCategoryDocument,
    "\n  mutation RemoveCategory($removeCategoryId: String!) {\n    removeCategory(id: $removeCategoryId) {\n      id\n      name\n    }\n  }\n": typeof types.RemoveCategoryDocument,
    "\n  mutation UpdateArticleById(\n    $updateArticleId: String!\n    $payload: UpdateArticleDto!\n  ) {\n    updateArticle(id: $updateArticleId, payload: $payload) {\n      category {\n        name\n      }\n      media {\n        id\n        url\n      }\n      title\n      slug\n      excerpt\n      content\n      status\n    }\n  }\n": typeof types.UpdateArticleByIdDocument,
    "\n  mutation RestoreArticleById($restoreArticleId: String!) {\n    restoreArticle(id: $restoreArticleId) {\n      id\n      title\n    }\n  }\n": typeof types.RestoreArticleByIdDocument,
    "\n  mutation HardDeleteArticleById($hardDeleteArticleId: String!) {\n    hardDeleteArticle(id: $hardDeleteArticleId) {\n      id\n      title\n    }\n  }\n": typeof types.HardDeleteArticleByIdDocument,
    "\n  mutation CreateArticle($payload: CreateArticleDto!) {\n    createArticle(payload: $payload) {\n      category {\n        id\n        name\n      }\n      media {\n        id\n        url\n      }\n      id\n      title\n      content\n      slug\n      excerpt\n      status\n    }\n  }\n": typeof types.CreateArticleDocument,
    "\n  mutation UpdateInquiryStatus($updateInquiryId: String!, $updateInquiryInput: UpdateInquiryInput!) {\n    updateInquiry(id: $updateInquiryId, updateInquiryInput: $updateInquiryInput) {\n      id\n      status\n    }\n  }\n": typeof types.UpdateInquiryStatusDocument,
    "\n  mutation RemoveInquiry($removeInquiryId: String!) {\n    removeInquiry(id: $removeInquiryId) {\n      id\n      name\n      email\n      message\n      phone\n      status\n    }\n  }\n": typeof types.RemoveInquiryDocument,
    "\n  mutation RemoveManyInquiries($removeManyInquiriesInput: RemoveManyInquiriesInput!) {\n    removeManyInquiries(removeManyInquiriesInput: $removeManyInquiriesInput) {\n      count\n    }\n  }\n": typeof types.RemoveManyInquiriesDocument,
    "\n  mutation CreateProduct($createProductInput: CreateProductInput!) {\n  createProduct(createProductInput: $createProductInput) {\n    id\n    category {\n      id\n      name\n    }\n    media {\n      id\n      url\n    }\n    name\n    tagline\n    description\n    icon\n    isActive\n    slug\n    createdAt\n    updatedAt\n  }\n}\n": typeof types.CreateProductDocument,
    "\n  mutation UpdateProductById($updateProductInput: UpdateProductInput!) {\n  updateProduct(updateProductInput: $updateProductInput) {\n    id\n    name\n    icon\n    slug\n    tagline\n    isActive\n    media {\n      id\n      url\n    }\n    category {\n      id\n      name\n    }\n  }\n}\n": typeof types.UpdateProductByIdDocument,
    "\n  mutation RemoveProduct($removeProductId: String!) {\n  removeProduct(id: $removeProductId) {\n    id\n    name\n  }\n}\n  ": typeof types.RemoveProductDocument,
    "\n  mutation createTeamMember($createTeamMemberInput: CreateTeamMemberInput!) {\n    createTeamMember(createTeamMemberInput: $createTeamMemberInput) {\n      name\n      position\n      socials\n    }\n  }\n": typeof types.CreateTeamMemberDocument,
    "\n  mutation UpdateTeamMember($updateTeamMemberId: String!, $updateTeamMemberInput: UpdateTeamMemberInput!) {\n    updateTeamMember(id: $updateTeamMemberId, updateTeamMemberInput: $updateTeamMemberInput) {\n      id\n      name\n      position\n      socials\n      image\n    }\n  }\n": typeof types.UpdateTeamMemberDocument,
    "\n  mutation RemoveTeamMember($removeTeamMemberId: String!) {\n    removeTeamMember(id: $removeTeamMemberId) {\n      id\n      name\n    }\n  }\n": typeof types.RemoveTeamMemberDocument,
    "\n  mutation CreateTestimony($payload: CreateTestimonyInput!) {\n    createTestimony(payload: $payload) {\n      id\n      name\n      content\n      createdAt\n      updatedAt\n      company\n      avatarUrl\n      isActive\n      position\n    }\n  }\n": typeof types.CreateTestimonyDocument,
    "\n  mutation UpdateTestimonyById($updateTestimonyId: String!, $payload: UpdateTestimonyInput!) {\n    updateTestimony(id: $updateTestimonyId, payload: $payload) {\n      id\n      name\n      content\n      createdAt\n      updatedAt\n      company\n      avatarUrl\n      isActive\n      position\n    }\n  }\n": typeof types.UpdateTestimonyByIdDocument,
    "\n  mutation RemoveTestimony($removeTestimonyId: String!) {\n    removeTestimony(id: $removeTestimonyId) {\n      id\n      name\n    }\n  }\n": typeof types.RemoveTestimonyDocument,
    "\n  mutation CreateGallery($payload: CreateGalleryDto!) {\n  createGallery(payload: $payload) {\n    id\n    title\n    status\n    media {\n      url\n    }\n    createdAt\n  }\n}\n": typeof types.CreateGalleryDocument,
    "\n  mutation UpdateGalleryById($updateGalleryId: String!, $payload: UpdateGalleryDto!) {\n    updateGallery(id: $updateGalleryId, payload: $payload) {\n      id\n      title\n      status\n      media {\n        id\n        url\n      }\n      updatedAt\n    }\n  }\n": typeof types.UpdateGalleryByIdDocument,
    "\n  mutation RemoveGallery($removeGalleryId: String!) {\n    removeGallery(id: $removeGalleryId) {\n      id\n      title\n    }\n  }\n": typeof types.RemoveGalleryDocument,
    "\n  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {\n  updateMyProfile(input: $input) {\n    id\n    lastName\n    firstName\n    avatar\n    user {\n      username\n      email\n    }\n  }\n}\n  ": typeof types.UpdateMyProfileDocument,
    "\n  mutation ChangePassword($input: ChangePasswordInput!) {\n  changePassword(input: $input) {\n    message\n  }\n}\n  ": typeof types.ChangePasswordDocument,
    "\n  mutation UpdateCompanyProfile($updateCompanyProfileInput: UpdateCompanyProfileInput!) {\n  updateCompanyProfile(updateCompanyProfileInput: $updateCompanyProfileInput) {\n    id\n    email\n    address\n    phone\n    socials\n    updatedAt\n  }\n}\n  ": typeof types.UpdateCompanyProfileDocument,
    "\n  query QueryMe {\n    meQuery {\n      isSignedIn\n      user {\n        id\n        username\n        email\n        profile {\n          id\n          lastName\n          firstName\n          avatar\n        }\n      }\n    }\n  }\n": typeof types.QueryMeDocument,
    "\n  query TestConnection {\n    __schema {\n      types {\n        name\n      }\n    }\n    meQuery {\n      user {\n        profile {\n          firstName\n        }\n      }\n    }\n    adminArticles {  \n    id\n    createdAt\n    title\n    status\n    updatedAt\n    author {\n      id\n      role\n      username\n      profile {\n        id\n        avatar\n        }\n      }\n    }\n    adminProducts {\n    id\n    isActive\n    }\n    teamMembers {\n    id\n    }\n    inquiries {\n    id\n    name\n    message\n    status\n    createdAt\n    }\n  }\n": typeof types.TestConnectionDocument,
    "\n  query getPosts {\n    categories {\n    id\n    name\n  }    \n    adminArticles {\n    id\n    createdAt\n    title\n    status\n    updatedAt\n    slug\n    author {\n      username\n      profile {\n        avatar\n        }\n      }\n    category {\n      id\n      name\n    }\n    media {\n      id\n      url\n    }\n    }\n  }\n": typeof types.GetPostsDocument,
    "\n  query getInquiries {\n    inquiries {\n    id\n    name\n    status\n    createdAt\n  }\n}\n": typeof types.GetInquiriesDocument,
    "\n  query getProducts {\n    adminProducts {\n    id\n    isActive\n    name\n    description\n    category {\n      id\n      name\n    }\n  }\n    categories {\n    id\n    name\n  }\n}\n": typeof types.GetProductsDocument,
    "\n  query getTeamMembers {\n    teamMembers {\n    id\n    name\n    image\n    position\n    socials\n  }\n}\n": typeof types.GetTeamMembersDocument,
    "\n  query AdminTestimonies {\n  adminTestimonies {\n    id\n    name\n    content\n    createdAt\n    updatedAt\n    company\n    avatarUrl\n    isActive\n    position\n  }\n}\n": typeof types.AdminTestimoniesDocument,
    "\n  query AdminGalleries {\n  adminGalleries {\n    id\n    title\n    createdAt\n    updatedAt\n    status\n    media {\n    id\n    url\n    }\n  }\n}\n": typeof types.AdminGalleriesDocument,
    "\n  query AdminGallery($id: String!) {\n  adminGallery(id: $id) {\n    id\n    title\n    status\n    media {\n      id\n      url\n    }\n    createdAt\n    updatedAt\n  }\n}\n": typeof types.AdminGalleryDocument,
    "\n  query getSettings {\n  companyProfile {\n    id\n    address\n    email\n    phone\n    socials\n  }\n}\n": typeof types.GetSettingsDocument,
    "\n  query getArticleById($id: String!) {\n    categoriesAdmin {\n    id\n    name\n    }\n    adminArticle(id: $id) {\n    id\n    category {\n      name\n      id\n    }\n    updatedAt\n    content\n    slug\n    title\n    excerpt\n    status\n    media {\n    id\n    url\n    }\n    }\n  }\n": typeof types.GetArticleByIdDocument,
    "\n  query getAllCategories {\n    categoriesAdmin {\n    id\n    name\n    description\n  }\n}\n": typeof types.GetAllCategoriesDocument,
    "\n  query getInquiryById($inquiryId: String!) {\n    inquiry(id: $inquiryId) {\n    id\n    createdAt\n    email\n    message\n    name\n    phone\n    status\n  }\n}\n": typeof types.GetInquiryByIdDocument,
    "\n  query AdminProduct($adminProductId: String!) {\n    categoriesAdmin {\n    id\n    name\n    }\n    adminProduct(id: $adminProductId) {\n    id\n    category {\n      id\n      name\n    }\n    icon\n    name\n    tagline\n    description\n    isActive\n    media {\n    id\n    url\n    }\n    createdAt\n    updatedAt\n    slug\n    order\n  }\n}\n": typeof types.AdminProductDocument,
    "\n  query AdminTestimony($adminTestimonyId: String!) {\n    adminTestimony(id: $adminTestimonyId) {\n    id\n    name\n    content\n    createdAt\n    updatedAt\n    company\n    avatarUrl\n    isActive\n    position\n  }\n}\n": typeof types.AdminTestimonyDocument,
    "\n  mutation RefreshToken {\n    refreshToken {\n      user { id }\n    }\n  }\n": typeof types.RefreshTokenDocument,
    "\n  query MeQuery {\n    meQuery {\n      isSignedIn\n      user {\n        id\n        username\n      }\n    }\n  }\n": typeof types.MeQueryDocument,
};
const documents: Documents = {
    "\n  mutation SignIn($signInInput: SignInInput!) {\n    signin(signInInput: $signInInput) {\n      isSignedIn\n      accessToken\n      refreshToken\n    }\n  }\n": types.SignInDocument,
    "\n  mutation LogOut {\n    logOut {\n      message\n    }\n  }\n": types.LogOutDocument,
    "\n  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {\n    createCategory(createCategoryInput: $createCategoryInput) {\n      slug\n      name\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($updateCategoryInput: UpdateCategoryInput!) {\n  updateCategory(updateCategoryInput: $updateCategoryInput) {\n    id\n    name\n    description\n    slug\n  }\n}\n": types.UpdateCategoryDocument,
    "\n  mutation RemoveCategory($removeCategoryId: String!) {\n    removeCategory(id: $removeCategoryId) {\n      id\n      name\n    }\n  }\n": types.RemoveCategoryDocument,
    "\n  mutation UpdateArticleById(\n    $updateArticleId: String!\n    $payload: UpdateArticleDto!\n  ) {\n    updateArticle(id: $updateArticleId, payload: $payload) {\n      category {\n        name\n      }\n      media {\n        id\n        url\n      }\n      title\n      slug\n      excerpt\n      content\n      status\n    }\n  }\n": types.UpdateArticleByIdDocument,
    "\n  mutation RestoreArticleById($restoreArticleId: String!) {\n    restoreArticle(id: $restoreArticleId) {\n      id\n      title\n    }\n  }\n": types.RestoreArticleByIdDocument,
    "\n  mutation HardDeleteArticleById($hardDeleteArticleId: String!) {\n    hardDeleteArticle(id: $hardDeleteArticleId) {\n      id\n      title\n    }\n  }\n": types.HardDeleteArticleByIdDocument,
    "\n  mutation CreateArticle($payload: CreateArticleDto!) {\n    createArticle(payload: $payload) {\n      category {\n        id\n        name\n      }\n      media {\n        id\n        url\n      }\n      id\n      title\n      content\n      slug\n      excerpt\n      status\n    }\n  }\n": types.CreateArticleDocument,
    "\n  mutation UpdateInquiryStatus($updateInquiryId: String!, $updateInquiryInput: UpdateInquiryInput!) {\n    updateInquiry(id: $updateInquiryId, updateInquiryInput: $updateInquiryInput) {\n      id\n      status\n    }\n  }\n": types.UpdateInquiryStatusDocument,
    "\n  mutation RemoveInquiry($removeInquiryId: String!) {\n    removeInquiry(id: $removeInquiryId) {\n      id\n      name\n      email\n      message\n      phone\n      status\n    }\n  }\n": types.RemoveInquiryDocument,
    "\n  mutation RemoveManyInquiries($removeManyInquiriesInput: RemoveManyInquiriesInput!) {\n    removeManyInquiries(removeManyInquiriesInput: $removeManyInquiriesInput) {\n      count\n    }\n  }\n": types.RemoveManyInquiriesDocument,
    "\n  mutation CreateProduct($createProductInput: CreateProductInput!) {\n  createProduct(createProductInput: $createProductInput) {\n    id\n    category {\n      id\n      name\n    }\n    media {\n      id\n      url\n    }\n    name\n    tagline\n    description\n    icon\n    isActive\n    slug\n    createdAt\n    updatedAt\n  }\n}\n": types.CreateProductDocument,
    "\n  mutation UpdateProductById($updateProductInput: UpdateProductInput!) {\n  updateProduct(updateProductInput: $updateProductInput) {\n    id\n    name\n    icon\n    slug\n    tagline\n    isActive\n    media {\n      id\n      url\n    }\n    category {\n      id\n      name\n    }\n  }\n}\n": types.UpdateProductByIdDocument,
    "\n  mutation RemoveProduct($removeProductId: String!) {\n  removeProduct(id: $removeProductId) {\n    id\n    name\n  }\n}\n  ": types.RemoveProductDocument,
    "\n  mutation createTeamMember($createTeamMemberInput: CreateTeamMemberInput!) {\n    createTeamMember(createTeamMemberInput: $createTeamMemberInput) {\n      name\n      position\n      socials\n    }\n  }\n": types.CreateTeamMemberDocument,
    "\n  mutation UpdateTeamMember($updateTeamMemberId: String!, $updateTeamMemberInput: UpdateTeamMemberInput!) {\n    updateTeamMember(id: $updateTeamMemberId, updateTeamMemberInput: $updateTeamMemberInput) {\n      id\n      name\n      position\n      socials\n      image\n    }\n  }\n": types.UpdateTeamMemberDocument,
    "\n  mutation RemoveTeamMember($removeTeamMemberId: String!) {\n    removeTeamMember(id: $removeTeamMemberId) {\n      id\n      name\n    }\n  }\n": types.RemoveTeamMemberDocument,
    "\n  mutation CreateTestimony($payload: CreateTestimonyInput!) {\n    createTestimony(payload: $payload) {\n      id\n      name\n      content\n      createdAt\n      updatedAt\n      company\n      avatarUrl\n      isActive\n      position\n    }\n  }\n": types.CreateTestimonyDocument,
    "\n  mutation UpdateTestimonyById($updateTestimonyId: String!, $payload: UpdateTestimonyInput!) {\n    updateTestimony(id: $updateTestimonyId, payload: $payload) {\n      id\n      name\n      content\n      createdAt\n      updatedAt\n      company\n      avatarUrl\n      isActive\n      position\n    }\n  }\n": types.UpdateTestimonyByIdDocument,
    "\n  mutation RemoveTestimony($removeTestimonyId: String!) {\n    removeTestimony(id: $removeTestimonyId) {\n      id\n      name\n    }\n  }\n": types.RemoveTestimonyDocument,
    "\n  mutation CreateGallery($payload: CreateGalleryDto!) {\n  createGallery(payload: $payload) {\n    id\n    title\n    status\n    media {\n      url\n    }\n    createdAt\n  }\n}\n": types.CreateGalleryDocument,
    "\n  mutation UpdateGalleryById($updateGalleryId: String!, $payload: UpdateGalleryDto!) {\n    updateGallery(id: $updateGalleryId, payload: $payload) {\n      id\n      title\n      status\n      media {\n        id\n        url\n      }\n      updatedAt\n    }\n  }\n": types.UpdateGalleryByIdDocument,
    "\n  mutation RemoveGallery($removeGalleryId: String!) {\n    removeGallery(id: $removeGalleryId) {\n      id\n      title\n    }\n  }\n": types.RemoveGalleryDocument,
    "\n  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {\n  updateMyProfile(input: $input) {\n    id\n    lastName\n    firstName\n    avatar\n    user {\n      username\n      email\n    }\n  }\n}\n  ": types.UpdateMyProfileDocument,
    "\n  mutation ChangePassword($input: ChangePasswordInput!) {\n  changePassword(input: $input) {\n    message\n  }\n}\n  ": types.ChangePasswordDocument,
    "\n  mutation UpdateCompanyProfile($updateCompanyProfileInput: UpdateCompanyProfileInput!) {\n  updateCompanyProfile(updateCompanyProfileInput: $updateCompanyProfileInput) {\n    id\n    email\n    address\n    phone\n    socials\n    updatedAt\n  }\n}\n  ": types.UpdateCompanyProfileDocument,
    "\n  query QueryMe {\n    meQuery {\n      isSignedIn\n      user {\n        id\n        username\n        email\n        profile {\n          id\n          lastName\n          firstName\n          avatar\n        }\n      }\n    }\n  }\n": types.QueryMeDocument,
    "\n  query TestConnection {\n    __schema {\n      types {\n        name\n      }\n    }\n    meQuery {\n      user {\n        profile {\n          firstName\n        }\n      }\n    }\n    adminArticles {  \n    id\n    createdAt\n    title\n    status\n    updatedAt\n    author {\n      id\n      role\n      username\n      profile {\n        id\n        avatar\n        }\n      }\n    }\n    adminProducts {\n    id\n    isActive\n    }\n    teamMembers {\n    id\n    }\n    inquiries {\n    id\n    name\n    message\n    status\n    createdAt\n    }\n  }\n": types.TestConnectionDocument,
    "\n  query getPosts {\n    categories {\n    id\n    name\n  }    \n    adminArticles {\n    id\n    createdAt\n    title\n    status\n    updatedAt\n    slug\n    author {\n      username\n      profile {\n        avatar\n        }\n      }\n    category {\n      id\n      name\n    }\n    media {\n      id\n      url\n    }\n    }\n  }\n": types.GetPostsDocument,
    "\n  query getInquiries {\n    inquiries {\n    id\n    name\n    status\n    createdAt\n  }\n}\n": types.GetInquiriesDocument,
    "\n  query getProducts {\n    adminProducts {\n    id\n    isActive\n    name\n    description\n    category {\n      id\n      name\n    }\n  }\n    categories {\n    id\n    name\n  }\n}\n": types.GetProductsDocument,
    "\n  query getTeamMembers {\n    teamMembers {\n    id\n    name\n    image\n    position\n    socials\n  }\n}\n": types.GetTeamMembersDocument,
    "\n  query AdminTestimonies {\n  adminTestimonies {\n    id\n    name\n    content\n    createdAt\n    updatedAt\n    company\n    avatarUrl\n    isActive\n    position\n  }\n}\n": types.AdminTestimoniesDocument,
    "\n  query AdminGalleries {\n  adminGalleries {\n    id\n    title\n    createdAt\n    updatedAt\n    status\n    media {\n    id\n    url\n    }\n  }\n}\n": types.AdminGalleriesDocument,
    "\n  query AdminGallery($id: String!) {\n  adminGallery(id: $id) {\n    id\n    title\n    status\n    media {\n      id\n      url\n    }\n    createdAt\n    updatedAt\n  }\n}\n": types.AdminGalleryDocument,
    "\n  query getSettings {\n  companyProfile {\n    id\n    address\n    email\n    phone\n    socials\n  }\n}\n": types.GetSettingsDocument,
    "\n  query getArticleById($id: String!) {\n    categoriesAdmin {\n    id\n    name\n    }\n    adminArticle(id: $id) {\n    id\n    category {\n      name\n      id\n    }\n    updatedAt\n    content\n    slug\n    title\n    excerpt\n    status\n    media {\n    id\n    url\n    }\n    }\n  }\n": types.GetArticleByIdDocument,
    "\n  query getAllCategories {\n    categoriesAdmin {\n    id\n    name\n    description\n  }\n}\n": types.GetAllCategoriesDocument,
    "\n  query getInquiryById($inquiryId: String!) {\n    inquiry(id: $inquiryId) {\n    id\n    createdAt\n    email\n    message\n    name\n    phone\n    status\n  }\n}\n": types.GetInquiryByIdDocument,
    "\n  query AdminProduct($adminProductId: String!) {\n    categoriesAdmin {\n    id\n    name\n    }\n    adminProduct(id: $adminProductId) {\n    id\n    category {\n      id\n      name\n    }\n    icon\n    name\n    tagline\n    description\n    isActive\n    media {\n    id\n    url\n    }\n    createdAt\n    updatedAt\n    slug\n    order\n  }\n}\n": types.AdminProductDocument,
    "\n  query AdminTestimony($adminTestimonyId: String!) {\n    adminTestimony(id: $adminTestimonyId) {\n    id\n    name\n    content\n    createdAt\n    updatedAt\n    company\n    avatarUrl\n    isActive\n    position\n  }\n}\n": types.AdminTestimonyDocument,
    "\n  mutation RefreshToken {\n    refreshToken {\n      user { id }\n    }\n  }\n": types.RefreshTokenDocument,
    "\n  query MeQuery {\n    meQuery {\n      isSignedIn\n      user {\n        id\n        username\n      }\n    }\n  }\n": types.MeQueryDocument,
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
export function graphql(source: "\n  mutation SignIn($signInInput: SignInInput!) {\n    signin(signInInput: $signInInput) {\n      isSignedIn\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation SignIn($signInInput: SignInInput!) {\n    signin(signInInput: $signInInput) {\n      isSignedIn\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LogOut {\n    logOut {\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation LogOut {\n    logOut {\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {\n    createCategory(createCategoryInput: $createCategoryInput) {\n      slug\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {\n    createCategory(createCategoryInput: $createCategoryInput) {\n      slug\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCategory($updateCategoryInput: UpdateCategoryInput!) {\n  updateCategory(updateCategoryInput: $updateCategoryInput) {\n    id\n    name\n    description\n    slug\n  }\n}\n"): (typeof documents)["\n  mutation UpdateCategory($updateCategoryInput: UpdateCategoryInput!) {\n  updateCategory(updateCategoryInput: $updateCategoryInput) {\n    id\n    name\n    description\n    slug\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveCategory($removeCategoryId: String!) {\n    removeCategory(id: $removeCategoryId) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveCategory($removeCategoryId: String!) {\n    removeCategory(id: $removeCategoryId) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateArticleById(\n    $updateArticleId: String!\n    $payload: UpdateArticleDto!\n  ) {\n    updateArticle(id: $updateArticleId, payload: $payload) {\n      category {\n        name\n      }\n      media {\n        id\n        url\n      }\n      title\n      slug\n      excerpt\n      content\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateArticleById(\n    $updateArticleId: String!\n    $payload: UpdateArticleDto!\n  ) {\n    updateArticle(id: $updateArticleId, payload: $payload) {\n      category {\n        name\n      }\n      media {\n        id\n        url\n      }\n      title\n      slug\n      excerpt\n      content\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RestoreArticleById($restoreArticleId: String!) {\n    restoreArticle(id: $restoreArticleId) {\n      id\n      title\n    }\n  }\n"): (typeof documents)["\n  mutation RestoreArticleById($restoreArticleId: String!) {\n    restoreArticle(id: $restoreArticleId) {\n      id\n      title\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation HardDeleteArticleById($hardDeleteArticleId: String!) {\n    hardDeleteArticle(id: $hardDeleteArticleId) {\n      id\n      title\n    }\n  }\n"): (typeof documents)["\n  mutation HardDeleteArticleById($hardDeleteArticleId: String!) {\n    hardDeleteArticle(id: $hardDeleteArticleId) {\n      id\n      title\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateArticle($payload: CreateArticleDto!) {\n    createArticle(payload: $payload) {\n      category {\n        id\n        name\n      }\n      media {\n        id\n        url\n      }\n      id\n      title\n      content\n      slug\n      excerpt\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation CreateArticle($payload: CreateArticleDto!) {\n    createArticle(payload: $payload) {\n      category {\n        id\n        name\n      }\n      media {\n        id\n        url\n      }\n      id\n      title\n      content\n      slug\n      excerpt\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateInquiryStatus($updateInquiryId: String!, $updateInquiryInput: UpdateInquiryInput!) {\n    updateInquiry(id: $updateInquiryId, updateInquiryInput: $updateInquiryInput) {\n      id\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateInquiryStatus($updateInquiryId: String!, $updateInquiryInput: UpdateInquiryInput!) {\n    updateInquiry(id: $updateInquiryId, updateInquiryInput: $updateInquiryInput) {\n      id\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveInquiry($removeInquiryId: String!) {\n    removeInquiry(id: $removeInquiryId) {\n      id\n      name\n      email\n      message\n      phone\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveInquiry($removeInquiryId: String!) {\n    removeInquiry(id: $removeInquiryId) {\n      id\n      name\n      email\n      message\n      phone\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveManyInquiries($removeManyInquiriesInput: RemoveManyInquiriesInput!) {\n    removeManyInquiries(removeManyInquiriesInput: $removeManyInquiriesInput) {\n      count\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveManyInquiries($removeManyInquiriesInput: RemoveManyInquiriesInput!) {\n    removeManyInquiries(removeManyInquiriesInput: $removeManyInquiriesInput) {\n      count\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateProduct($createProductInput: CreateProductInput!) {\n  createProduct(createProductInput: $createProductInput) {\n    id\n    category {\n      id\n      name\n    }\n    media {\n      id\n      url\n    }\n    name\n    tagline\n    description\n    icon\n    isActive\n    slug\n    createdAt\n    updatedAt\n  }\n}\n"): (typeof documents)["\n  mutation CreateProduct($createProductInput: CreateProductInput!) {\n  createProduct(createProductInput: $createProductInput) {\n    id\n    category {\n      id\n      name\n    }\n    media {\n      id\n      url\n    }\n    name\n    tagline\n    description\n    icon\n    isActive\n    slug\n    createdAt\n    updatedAt\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProductById($updateProductInput: UpdateProductInput!) {\n  updateProduct(updateProductInput: $updateProductInput) {\n    id\n    name\n    icon\n    slug\n    tagline\n    isActive\n    media {\n      id\n      url\n    }\n    category {\n      id\n      name\n    }\n  }\n}\n"): (typeof documents)["\n  mutation UpdateProductById($updateProductInput: UpdateProductInput!) {\n  updateProduct(updateProductInput: $updateProductInput) {\n    id\n    name\n    icon\n    slug\n    tagline\n    isActive\n    media {\n      id\n      url\n    }\n    category {\n      id\n      name\n    }\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveProduct($removeProductId: String!) {\n  removeProduct(id: $removeProductId) {\n    id\n    name\n  }\n}\n  "): (typeof documents)["\n  mutation RemoveProduct($removeProductId: String!) {\n  removeProduct(id: $removeProductId) {\n    id\n    name\n  }\n}\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createTeamMember($createTeamMemberInput: CreateTeamMemberInput!) {\n    createTeamMember(createTeamMemberInput: $createTeamMemberInput) {\n      name\n      position\n      socials\n    }\n  }\n"): (typeof documents)["\n  mutation createTeamMember($createTeamMemberInput: CreateTeamMemberInput!) {\n    createTeamMember(createTeamMemberInput: $createTeamMemberInput) {\n      name\n      position\n      socials\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTeamMember($updateTeamMemberId: String!, $updateTeamMemberInput: UpdateTeamMemberInput!) {\n    updateTeamMember(id: $updateTeamMemberId, updateTeamMemberInput: $updateTeamMemberInput) {\n      id\n      name\n      position\n      socials\n      image\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTeamMember($updateTeamMemberId: String!, $updateTeamMemberInput: UpdateTeamMemberInput!) {\n    updateTeamMember(id: $updateTeamMemberId, updateTeamMemberInput: $updateTeamMemberInput) {\n      id\n      name\n      position\n      socials\n      image\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveTeamMember($removeTeamMemberId: String!) {\n    removeTeamMember(id: $removeTeamMemberId) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveTeamMember($removeTeamMemberId: String!) {\n    removeTeamMember(id: $removeTeamMemberId) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTestimony($payload: CreateTestimonyInput!) {\n    createTestimony(payload: $payload) {\n      id\n      name\n      content\n      createdAt\n      updatedAt\n      company\n      avatarUrl\n      isActive\n      position\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTestimony($payload: CreateTestimonyInput!) {\n    createTestimony(payload: $payload) {\n      id\n      name\n      content\n      createdAt\n      updatedAt\n      company\n      avatarUrl\n      isActive\n      position\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTestimonyById($updateTestimonyId: String!, $payload: UpdateTestimonyInput!) {\n    updateTestimony(id: $updateTestimonyId, payload: $payload) {\n      id\n      name\n      content\n      createdAt\n      updatedAt\n      company\n      avatarUrl\n      isActive\n      position\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTestimonyById($updateTestimonyId: String!, $payload: UpdateTestimonyInput!) {\n    updateTestimony(id: $updateTestimonyId, payload: $payload) {\n      id\n      name\n      content\n      createdAt\n      updatedAt\n      company\n      avatarUrl\n      isActive\n      position\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveTestimony($removeTestimonyId: String!) {\n    removeTestimony(id: $removeTestimonyId) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveTestimony($removeTestimonyId: String!) {\n    removeTestimony(id: $removeTestimonyId) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateGallery($payload: CreateGalleryDto!) {\n  createGallery(payload: $payload) {\n    id\n    title\n    status\n    media {\n      url\n    }\n    createdAt\n  }\n}\n"): (typeof documents)["\n  mutation CreateGallery($payload: CreateGalleryDto!) {\n  createGallery(payload: $payload) {\n    id\n    title\n    status\n    media {\n      url\n    }\n    createdAt\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateGalleryById($updateGalleryId: String!, $payload: UpdateGalleryDto!) {\n    updateGallery(id: $updateGalleryId, payload: $payload) {\n      id\n      title\n      status\n      media {\n        id\n        url\n      }\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateGalleryById($updateGalleryId: String!, $payload: UpdateGalleryDto!) {\n    updateGallery(id: $updateGalleryId, payload: $payload) {\n      id\n      title\n      status\n      media {\n        id\n        url\n      }\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveGallery($removeGalleryId: String!) {\n    removeGallery(id: $removeGalleryId) {\n      id\n      title\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveGallery($removeGalleryId: String!) {\n    removeGallery(id: $removeGalleryId) {\n      id\n      title\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {\n  updateMyProfile(input: $input) {\n    id\n    lastName\n    firstName\n    avatar\n    user {\n      username\n      email\n    }\n  }\n}\n  "): (typeof documents)["\n  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {\n  updateMyProfile(input: $input) {\n    id\n    lastName\n    firstName\n    avatar\n    user {\n      username\n      email\n    }\n  }\n}\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangePassword($input: ChangePasswordInput!) {\n  changePassword(input: $input) {\n    message\n  }\n}\n  "): (typeof documents)["\n  mutation ChangePassword($input: ChangePasswordInput!) {\n  changePassword(input: $input) {\n    message\n  }\n}\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCompanyProfile($updateCompanyProfileInput: UpdateCompanyProfileInput!) {\n  updateCompanyProfile(updateCompanyProfileInput: $updateCompanyProfileInput) {\n    id\n    email\n    address\n    phone\n    socials\n    updatedAt\n  }\n}\n  "): (typeof documents)["\n  mutation UpdateCompanyProfile($updateCompanyProfileInput: UpdateCompanyProfileInput!) {\n  updateCompanyProfile(updateCompanyProfileInput: $updateCompanyProfileInput) {\n    id\n    email\n    address\n    phone\n    socials\n    updatedAt\n  }\n}\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query QueryMe {\n    meQuery {\n      isSignedIn\n      user {\n        id\n        username\n        email\n        profile {\n          id\n          lastName\n          firstName\n          avatar\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query QueryMe {\n    meQuery {\n      isSignedIn\n      user {\n        id\n        username\n        email\n        profile {\n          id\n          lastName\n          firstName\n          avatar\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TestConnection {\n    __schema {\n      types {\n        name\n      }\n    }\n    meQuery {\n      user {\n        profile {\n          firstName\n        }\n      }\n    }\n    adminArticles {  \n    id\n    createdAt\n    title\n    status\n    updatedAt\n    author {\n      id\n      role\n      username\n      profile {\n        id\n        avatar\n        }\n      }\n    }\n    adminProducts {\n    id\n    isActive\n    }\n    teamMembers {\n    id\n    }\n    inquiries {\n    id\n    name\n    message\n    status\n    createdAt\n    }\n  }\n"): (typeof documents)["\n  query TestConnection {\n    __schema {\n      types {\n        name\n      }\n    }\n    meQuery {\n      user {\n        profile {\n          firstName\n        }\n      }\n    }\n    adminArticles {  \n    id\n    createdAt\n    title\n    status\n    updatedAt\n    author {\n      id\n      role\n      username\n      profile {\n        id\n        avatar\n        }\n      }\n    }\n    adminProducts {\n    id\n    isActive\n    }\n    teamMembers {\n    id\n    }\n    inquiries {\n    id\n    name\n    message\n    status\n    createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getPosts {\n    categories {\n    id\n    name\n  }    \n    adminArticles {\n    id\n    createdAt\n    title\n    status\n    updatedAt\n    slug\n    author {\n      username\n      profile {\n        avatar\n        }\n      }\n    category {\n      id\n      name\n    }\n    media {\n      id\n      url\n    }\n    }\n  }\n"): (typeof documents)["\n  query getPosts {\n    categories {\n    id\n    name\n  }    \n    adminArticles {\n    id\n    createdAt\n    title\n    status\n    updatedAt\n    slug\n    author {\n      username\n      profile {\n        avatar\n        }\n      }\n    category {\n      id\n      name\n    }\n    media {\n      id\n      url\n    }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getInquiries {\n    inquiries {\n    id\n    name\n    status\n    createdAt\n  }\n}\n"): (typeof documents)["\n  query getInquiries {\n    inquiries {\n    id\n    name\n    status\n    createdAt\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getProducts {\n    adminProducts {\n    id\n    isActive\n    name\n    description\n    category {\n      id\n      name\n    }\n  }\n    categories {\n    id\n    name\n  }\n}\n"): (typeof documents)["\n  query getProducts {\n    adminProducts {\n    id\n    isActive\n    name\n    description\n    category {\n      id\n      name\n    }\n  }\n    categories {\n    id\n    name\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getTeamMembers {\n    teamMembers {\n    id\n    name\n    image\n    position\n    socials\n  }\n}\n"): (typeof documents)["\n  query getTeamMembers {\n    teamMembers {\n    id\n    name\n    image\n    position\n    socials\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminTestimonies {\n  adminTestimonies {\n    id\n    name\n    content\n    createdAt\n    updatedAt\n    company\n    avatarUrl\n    isActive\n    position\n  }\n}\n"): (typeof documents)["\n  query AdminTestimonies {\n  adminTestimonies {\n    id\n    name\n    content\n    createdAt\n    updatedAt\n    company\n    avatarUrl\n    isActive\n    position\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminGalleries {\n  adminGalleries {\n    id\n    title\n    createdAt\n    updatedAt\n    status\n    media {\n    id\n    url\n    }\n  }\n}\n"): (typeof documents)["\n  query AdminGalleries {\n  adminGalleries {\n    id\n    title\n    createdAt\n    updatedAt\n    status\n    media {\n    id\n    url\n    }\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminGallery($id: String!) {\n  adminGallery(id: $id) {\n    id\n    title\n    status\n    media {\n      id\n      url\n    }\n    createdAt\n    updatedAt\n  }\n}\n"): (typeof documents)["\n  query AdminGallery($id: String!) {\n  adminGallery(id: $id) {\n    id\n    title\n    status\n    media {\n      id\n      url\n    }\n    createdAt\n    updatedAt\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getSettings {\n  companyProfile {\n    id\n    address\n    email\n    phone\n    socials\n  }\n}\n"): (typeof documents)["\n  query getSettings {\n  companyProfile {\n    id\n    address\n    email\n    phone\n    socials\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getArticleById($id: String!) {\n    categoriesAdmin {\n    id\n    name\n    }\n    adminArticle(id: $id) {\n    id\n    category {\n      name\n      id\n    }\n    updatedAt\n    content\n    slug\n    title\n    excerpt\n    status\n    media {\n    id\n    url\n    }\n    }\n  }\n"): (typeof documents)["\n  query getArticleById($id: String!) {\n    categoriesAdmin {\n    id\n    name\n    }\n    adminArticle(id: $id) {\n    id\n    category {\n      name\n      id\n    }\n    updatedAt\n    content\n    slug\n    title\n    excerpt\n    status\n    media {\n    id\n    url\n    }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAllCategories {\n    categoriesAdmin {\n    id\n    name\n    description\n  }\n}\n"): (typeof documents)["\n  query getAllCategories {\n    categoriesAdmin {\n    id\n    name\n    description\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getInquiryById($inquiryId: String!) {\n    inquiry(id: $inquiryId) {\n    id\n    createdAt\n    email\n    message\n    name\n    phone\n    status\n  }\n}\n"): (typeof documents)["\n  query getInquiryById($inquiryId: String!) {\n    inquiry(id: $inquiryId) {\n    id\n    createdAt\n    email\n    message\n    name\n    phone\n    status\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminProduct($adminProductId: String!) {\n    categoriesAdmin {\n    id\n    name\n    }\n    adminProduct(id: $adminProductId) {\n    id\n    category {\n      id\n      name\n    }\n    icon\n    name\n    tagline\n    description\n    isActive\n    media {\n    id\n    url\n    }\n    createdAt\n    updatedAt\n    slug\n    order\n  }\n}\n"): (typeof documents)["\n  query AdminProduct($adminProductId: String!) {\n    categoriesAdmin {\n    id\n    name\n    }\n    adminProduct(id: $adminProductId) {\n    id\n    category {\n      id\n      name\n    }\n    icon\n    name\n    tagline\n    description\n    isActive\n    media {\n    id\n    url\n    }\n    createdAt\n    updatedAt\n    slug\n    order\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminTestimony($adminTestimonyId: String!) {\n    adminTestimony(id: $adminTestimonyId) {\n    id\n    name\n    content\n    createdAt\n    updatedAt\n    company\n    avatarUrl\n    isActive\n    position\n  }\n}\n"): (typeof documents)["\n  query AdminTestimony($adminTestimonyId: String!) {\n    adminTestimony(id: $adminTestimonyId) {\n    id\n    name\n    content\n    createdAt\n    updatedAt\n    company\n    avatarUrl\n    isActive\n    position\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RefreshToken {\n    refreshToken {\n      user { id }\n    }\n  }\n"): (typeof documents)["\n  mutation RefreshToken {\n    refreshToken {\n      user { id }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MeQuery {\n    meQuery {\n      isSignedIn\n      user {\n        id\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  query MeQuery {\n    meQuery {\n      isSignedIn\n      user {\n        id\n        username\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;