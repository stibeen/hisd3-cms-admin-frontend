import { graphql } from "./generated/gql";

export const SIGN_IN_MUTATION = graphql(`
  mutation SignIn($signInInput: SignInInput!) {
    signin(signInInput: $signInInput) {
      isSignedIn
      accessToken
      refreshToken
    }
  }
`);

export const LOG_OUT_MUTATION = graphql(`
  mutation LogOut {
    logOut {
      message
    }
  }
`);

export const CREATE_CATEGORY_MUTATION = graphql(`
  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {
    createCategory(createCategoryInput: $createCategoryInput) {
      slug
      name
    }
  }
`);

export const UPDATE_ARTICLE_BY_ID_MUTATION = graphql(`
  mutation UpdateArticleById(
    $updateArticleId: String!
    $payload: UpdateArticleDto!
  ) {
    updateArticle(id: $updateArticleId, payload: $payload) {
      category {
        name
      }
      title
      slug
      excerpt
      content
      status
    }
  }
`);

export const RESTORE_ARTICLE_BY_ID_MUTATION = graphql(`
  mutation RestoreArticleById($restoreArticleId: String!) {
    restoreArticle(id: $restoreArticleId) {
      id
      title
    }
  }
`);

export const HARD_DELETE_ARTICLE_BY_ID_MUTATION = graphql(`
  mutation HardDeleteArticleById($hardDeleteArticleId: String!) {
    hardDeleteArticle(id: $hardDeleteArticleId) {
      id
      title
    }
  }
`);

export const CREATE_ARTICLE_MUTATION = graphql(`
  mutation CreateArticle($payload: CreateArticleDto!) {
    createArticle(payload: $payload) {
      category {
        id
        name
      }
      id
      title
      content
      slug
      excerpt
      status
    }
  }
`);

export const CREATE_TEAM_MEMBER_MUTATION = graphql(`
  mutation createTeamMember($createTeamMemberInput: CreateTeamMemberInput!) {
    createTeamMember(createTeamMemberInput: $createTeamMemberInput) {
      name
      position
      socials
    }
  }
`);

export const REMOVE_TEAM_MEMBER_MUTATION = graphql(`
  mutation RemoveTeamMember($removeTeamMemberId: String!) {
    removeTeamMember(id: $removeTeamMemberId) {
      id
      name
    }
  }
`);


