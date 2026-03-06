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
    "\n  mutation UpdateArticleById(\n    $updateArticleId: String!\n    $payload: UpdateArticleDto!\n  ) {\n    updateArticle(id: $updateArticleId, payload: $payload) {\n      category {\n        name\n      }\n      title\n      slug\n      excerpt\n      content\n      status\n    }\n  }\n": typeof types.UpdateArticleByIdDocument,
    "\n  mutation RestoreArticleById($restoreArticleId: String!) {\n    restoreArticle(id: $restoreArticleId) {\n      id\n      title\n    }\n  }\n": typeof types.RestoreArticleByIdDocument,
    "\n  mutation HardDeleteArticleById($hardDeleteArticleId: String!) {\n    hardDeleteArticle(id: $hardDeleteArticleId) {\n      id\n      title\n    }\n  }\n": typeof types.HardDeleteArticleByIdDocument,
    "\n  mutation CreateArticle($payload: CreateArticleDto!) {\n    createArticle(payload: $payload) {\n      category {\n        id\n        name\n      }\n      id\n      title\n      content\n      slug\n      excerpt\n      status\n    }\n  }\n": typeof types.CreateArticleDocument,
    "\n  mutation createTeamMember($createTeamMemberInput: CreateTeamMemberInput!) {\n    createTeamMember(createTeamMemberInput: $createTeamMemberInput) {\n      name\n      position\n      socials\n    }\n  }\n": typeof types.CreateTeamMemberDocument,
    "\n  mutation RemoveTeamMember($removeTeamMemberId: String!) {\n    removeTeamMember(id: $removeTeamMemberId) {\n      id\n      name\n    }\n  }\n": typeof types.RemoveTeamMemberDocument,
    "\n  query TestConnection {\n    __schema {\n      types {\n        name\n      }\n    }\n    adminArticles {  \n    id\n    createdAt\n    title\n    status\n    updatedAt\n    author {\n      username\n      profile {\n        avatar\n        }\n      }\n    }\n    adminProducts {\n    id\n    isActive\n    }\n    teamMembers {\n    id\n    }\n    inquiries {\n    id\n    name\n    status\n    createdAt\n    }\n  }\n": typeof types.TestConnectionDocument,
    "\n  query getPosts {\n    categories {\n    id\n    name\n  }    \n    adminArticles {\n    id\n    createdAt\n    title\n    status\n    updatedAt\n    slug\n    author {\n      username\n      profile {\n        avatar\n        }\n      }\n    category {\n      id\n      name\n    }\n    }\n  }\n": typeof types.GetPostsDocument,
    "\n  query getInquiries {\n    inquiries {\n    id\n    name\n    status\n    createdAt\n  }\n}\n": typeof types.GetInquiriesDocument,
    "\n  query getProducts {\n    adminProducts {\n    id\n    isActive\n    name\n    description\n    category {\n      id\n      name\n    }\n  }\n    categories {\n    id\n    name\n  }\n}\n": typeof types.GetProductsDocument,
    "\n  query getTeamMembers {\n    teamMembers {\n    id\n    name\n    image\n    position\n    socials\n  }\n}\n": typeof types.GetTeamMembersDocument,
    "\n  query getArticleById($id: String!) {\n    categories {\n      id\n      name\n    }\n    adminArticle(id: $id) {\n    id\n    category {\n      name\n      id\n    }\n    updatedAt\n    content\n    slug\n    title\n    excerpt\n    status\n    media {\n    id\n    url\n    }\n    }\n  }\n": typeof types.GetArticleByIdDocument,
    "\n  query getAllCategories {\n    categories {\n    id\n    name\n  }\n}\n": typeof types.GetAllCategoriesDocument,
    "\n  mutation RefreshToken {\n    refreshToken {\n      user { id }\n    }\n  }\n": typeof types.RefreshTokenDocument,
    "\n  query MeQuery {\n    meQuery {\n      isSignedIn\n      user {\n        id\n        username\n      }\n    }\n  }\n": typeof types.MeQueryDocument,
};
const documents: Documents = {
    "\n  mutation SignIn($signInInput: SignInInput!) {\n    signin(signInInput: $signInInput) {\n      isSignedIn\n      accessToken\n      refreshToken\n    }\n  }\n": types.SignInDocument,
    "\n  mutation LogOut {\n    logOut {\n      message\n    }\n  }\n": types.LogOutDocument,
    "\n  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {\n    createCategory(createCategoryInput: $createCategoryInput) {\n      slug\n      name\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  mutation UpdateArticleById(\n    $updateArticleId: String!\n    $payload: UpdateArticleDto!\n  ) {\n    updateArticle(id: $updateArticleId, payload: $payload) {\n      category {\n        name\n      }\n      title\n      slug\n      excerpt\n      content\n      status\n    }\n  }\n": types.UpdateArticleByIdDocument,
    "\n  mutation RestoreArticleById($restoreArticleId: String!) {\n    restoreArticle(id: $restoreArticleId) {\n      id\n      title\n    }\n  }\n": types.RestoreArticleByIdDocument,
    "\n  mutation HardDeleteArticleById($hardDeleteArticleId: String!) {\n    hardDeleteArticle(id: $hardDeleteArticleId) {\n      id\n      title\n    }\n  }\n": types.HardDeleteArticleByIdDocument,
    "\n  mutation CreateArticle($payload: CreateArticleDto!) {\n    createArticle(payload: $payload) {\n      category {\n        id\n        name\n      }\n      id\n      title\n      content\n      slug\n      excerpt\n      status\n    }\n  }\n": types.CreateArticleDocument,
    "\n  mutation createTeamMember($createTeamMemberInput: CreateTeamMemberInput!) {\n    createTeamMember(createTeamMemberInput: $createTeamMemberInput) {\n      name\n      position\n      socials\n    }\n  }\n": types.CreateTeamMemberDocument,
    "\n  mutation RemoveTeamMember($removeTeamMemberId: String!) {\n    removeTeamMember(id: $removeTeamMemberId) {\n      id\n      name\n    }\n  }\n": types.RemoveTeamMemberDocument,
    "\n  query TestConnection {\n    __schema {\n      types {\n        name\n      }\n    }\n    adminArticles {  \n    id\n    createdAt\n    title\n    status\n    updatedAt\n    author {\n      username\n      profile {\n        avatar\n        }\n      }\n    }\n    adminProducts {\n    id\n    isActive\n    }\n    teamMembers {\n    id\n    }\n    inquiries {\n    id\n    name\n    status\n    createdAt\n    }\n  }\n": types.TestConnectionDocument,
    "\n  query getPosts {\n    categories {\n    id\n    name\n  }    \n    adminArticles {\n    id\n    createdAt\n    title\n    status\n    updatedAt\n    slug\n    author {\n      username\n      profile {\n        avatar\n        }\n      }\n    category {\n      id\n      name\n    }\n    }\n  }\n": types.GetPostsDocument,
    "\n  query getInquiries {\n    inquiries {\n    id\n    name\n    status\n    createdAt\n  }\n}\n": types.GetInquiriesDocument,
    "\n  query getProducts {\n    adminProducts {\n    id\n    isActive\n    name\n    description\n    category {\n      id\n      name\n    }\n  }\n    categories {\n    id\n    name\n  }\n}\n": types.GetProductsDocument,
    "\n  query getTeamMembers {\n    teamMembers {\n    id\n    name\n    image\n    position\n    socials\n  }\n}\n": types.GetTeamMembersDocument,
    "\n  query getArticleById($id: String!) {\n    categories {\n      id\n      name\n    }\n    adminArticle(id: $id) {\n    id\n    category {\n      name\n      id\n    }\n    updatedAt\n    content\n    slug\n    title\n    excerpt\n    status\n    media {\n    id\n    url\n    }\n    }\n  }\n": types.GetArticleByIdDocument,
    "\n  query getAllCategories {\n    categories {\n    id\n    name\n  }\n}\n": types.GetAllCategoriesDocument,
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
export function graphql(source: "\n  mutation UpdateArticleById(\n    $updateArticleId: String!\n    $payload: UpdateArticleDto!\n  ) {\n    updateArticle(id: $updateArticleId, payload: $payload) {\n      category {\n        name\n      }\n      title\n      slug\n      excerpt\n      content\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateArticleById(\n    $updateArticleId: String!\n    $payload: UpdateArticleDto!\n  ) {\n    updateArticle(id: $updateArticleId, payload: $payload) {\n      category {\n        name\n      }\n      title\n      slug\n      excerpt\n      content\n      status\n    }\n  }\n"];
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
export function graphql(source: "\n  mutation CreateArticle($payload: CreateArticleDto!) {\n    createArticle(payload: $payload) {\n      category {\n        id\n        name\n      }\n      id\n      title\n      content\n      slug\n      excerpt\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation CreateArticle($payload: CreateArticleDto!) {\n    createArticle(payload: $payload) {\n      category {\n        id\n        name\n      }\n      id\n      title\n      content\n      slug\n      excerpt\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createTeamMember($createTeamMemberInput: CreateTeamMemberInput!) {\n    createTeamMember(createTeamMemberInput: $createTeamMemberInput) {\n      name\n      position\n      socials\n    }\n  }\n"): (typeof documents)["\n  mutation createTeamMember($createTeamMemberInput: CreateTeamMemberInput!) {\n    createTeamMember(createTeamMemberInput: $createTeamMemberInput) {\n      name\n      position\n      socials\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveTeamMember($removeTeamMemberId: String!) {\n    removeTeamMember(id: $removeTeamMemberId) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveTeamMember($removeTeamMemberId: String!) {\n    removeTeamMember(id: $removeTeamMemberId) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TestConnection {\n    __schema {\n      types {\n        name\n      }\n    }\n    adminArticles {  \n    id\n    createdAt\n    title\n    status\n    updatedAt\n    author {\n      username\n      profile {\n        avatar\n        }\n      }\n    }\n    adminProducts {\n    id\n    isActive\n    }\n    teamMembers {\n    id\n    }\n    inquiries {\n    id\n    name\n    status\n    createdAt\n    }\n  }\n"): (typeof documents)["\n  query TestConnection {\n    __schema {\n      types {\n        name\n      }\n    }\n    adminArticles {  \n    id\n    createdAt\n    title\n    status\n    updatedAt\n    author {\n      username\n      profile {\n        avatar\n        }\n      }\n    }\n    adminProducts {\n    id\n    isActive\n    }\n    teamMembers {\n    id\n    }\n    inquiries {\n    id\n    name\n    status\n    createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getPosts {\n    categories {\n    id\n    name\n  }    \n    adminArticles {\n    id\n    createdAt\n    title\n    status\n    updatedAt\n    slug\n    author {\n      username\n      profile {\n        avatar\n        }\n      }\n    category {\n      id\n      name\n    }\n    }\n  }\n"): (typeof documents)["\n  query getPosts {\n    categories {\n    id\n    name\n  }    \n    adminArticles {\n    id\n    createdAt\n    title\n    status\n    updatedAt\n    slug\n    author {\n      username\n      profile {\n        avatar\n        }\n      }\n    category {\n      id\n      name\n    }\n    }\n  }\n"];
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
export function graphql(source: "\n  query getArticleById($id: String!) {\n    categories {\n      id\n      name\n    }\n    adminArticle(id: $id) {\n    id\n    category {\n      name\n      id\n    }\n    updatedAt\n    content\n    slug\n    title\n    excerpt\n    status\n    media {\n    id\n    url\n    }\n    }\n  }\n"): (typeof documents)["\n  query getArticleById($id: String!) {\n    categories {\n      id\n      name\n    }\n    adminArticle(id: $id) {\n    id\n    category {\n      name\n      id\n    }\n    updatedAt\n    content\n    slug\n    title\n    excerpt\n    status\n    media {\n    id\n    url\n    }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAllCategories {\n    categories {\n    id\n    name\n  }\n}\n"): (typeof documents)["\n  query getAllCategories {\n    categories {\n    id\n    name\n  }\n}\n"];
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