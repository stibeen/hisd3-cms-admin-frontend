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

export const UPDATE_INQUIRY_STATUS_MUTATION = graphql(`
  mutation UpdateInquiryStatus($updateInquiryId: String!, $updateInquiryInput: UpdateInquiryInput!) {
    updateInquiry(id: $updateInquiryId, updateInquiryInput: $updateInquiryInput) {
      id
      status
    }
  }
`);

export const REMOVE_INQUIRY_MUTATION = graphql(`
  mutation RemoveInquiry($removeInquiryId: String!) {
    removeInquiry(id: $removeInquiryId) {
      id
      name
      email
      message
      phone
      status
    }
  }
`);

export const CREATE_PRODUCT_MUTATION = graphql(`
  mutation CreateProduct($createProductInput: CreateProductInput!) {
  createProduct(createProductInput: $createProductInput) {
    id
    category {
      id
      name
    }
    media {
      id
      url
    }
    name
    tagline
    description
    icon
    isActive
    slug
    createdAt
    updatedAt
  }
}
`)

export const UPDATE_PRODUCT_BY_ID_MUTATION = graphql(`
  mutation UpdateProductById($updateProductInput: UpdateProductInput!) {
  updateProduct(updateProductInput: $updateProductInput) {
    id
    name
    icon
    slug
    tagline
    isActive
    media {
      id
      url
    }
    category {
      id
      name
    }
  }
}
`)

export const REMOVE_PRODUCT_MUTATION = graphql(`
  mutation RemoveProduct($removeProductId: String!) {
  removeProduct(id: $removeProductId) {
    id
    name
  }
}
  `)

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


