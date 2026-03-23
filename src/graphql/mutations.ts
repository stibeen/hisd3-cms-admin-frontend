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

export const UPDATE_CATEGORY_MUTATION = graphql(`
  mutation UpdateCategory($updateCategoryInput: UpdateCategoryInput!) {
  updateCategory(updateCategoryInput: $updateCategoryInput) {
    id
    name
    description
    slug
  }
}
`);

export const REMOVE_CATEGORY_MUTATION = graphql(`
  mutation RemoveCategory($removeCategoryId: String!) {
    removeCategory(id: $removeCategoryId) {
      id
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
      media {
        id
        url
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
      media {
        id
        url
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

export const REMOVE_MANY_INQUIRIES_MUTATION = graphql(`
  mutation RemoveManyInquiries($removeManyInquiriesInput: RemoveManyInquiriesInput!) {
    removeManyInquiries(removeManyInquiriesInput: $removeManyInquiriesInput) {
      count
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

export const UPDATE_TEAM_MEMBER_MUTATION = graphql(`
  mutation UpdateTeamMember($updateTeamMemberId: String!, $updateTeamMemberInput: UpdateTeamMemberInput!) {
    updateTeamMember(id: $updateTeamMemberId, updateTeamMemberInput: $updateTeamMemberInput) {
      id
      name
      position
      socials
      image
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

export const CREATE_TESTIMONY_MUTATION = graphql(`
  mutation CreateTestimony($payload: CreateTestimonyInput!) {
    createTestimony(payload: $payload) {
      id
      name
      content
      createdAt
      updatedAt
      company
      avatarUrl
      isActive
      position
    }
  }
`);

export const UPDATE_TESTIMONY_BY_ID_MUTATION = graphql(`
  mutation UpdateTestimonyById($updateTestimonyId: String!, $payload: UpdateTestimonyInput!) {
    updateTestimony(id: $updateTestimonyId, payload: $payload) {
      id
      name
      content
      createdAt
      updatedAt
      company
      avatarUrl
      isActive
      position
    }
  }
`);

export const REMOVE_TESTIMONY_MUTATION = graphql(`
  mutation RemoveTestimony($removeTestimonyId: String!) {
    removeTestimony(id: $removeTestimonyId) {
      id
      name
    }
  }
`);

export const CREATE_GALLERY_MUTATION = graphql(`
  mutation CreateGallery($payload: CreateGalleryDto!) {
  createGallery(payload: $payload) {
    id
    title
    status
    media {
      url
    }
    createdAt
  }
}
`)

export const UPDATE_GALLERY_BY_ID_MUTATION = graphql(`
  mutation UpdateGalleryById($updateGalleryId: String!, $payload: UpdateGalleryDto!) {
    updateGallery(id: $updateGalleryId, payload: $payload) {
      id
      title
      status
      media {
        id
        url
      }
      updatedAt
    }
  }
`)

export const REMOVE_GALLERY_MUTATION = graphql(`
  mutation RemoveGallery($removeGalleryId: String!) {
    removeGallery(id: $removeGalleryId) {
      id
      title
    }
  }
`)

export const UPDATE_USER_PROFILE_MUTATION = graphql(`
  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
  updateMyProfile(input: $input) {
    id
    lastName
    firstName
    avatar
    user {
      username
      email
    }
  }
}
  `)

export const UPDATE_PASSWORD_MUTATION = graphql(`
  mutation ChangePassword($input: ChangePasswordInput!) {
  changePassword(input: $input) {
    message
  }
}
  `)

export const UPDATE_COMPANY_PROFILE_MUTATION = graphql(`
  mutation UpdateCompanyProfile($updateCompanyProfileInput: UpdateCompanyProfileInput!) {
  updateCompanyProfile(updateCompanyProfileInput: $updateCompanyProfileInput) {
    id
    email
    address
    phone
    socials
  }
}
  `)

