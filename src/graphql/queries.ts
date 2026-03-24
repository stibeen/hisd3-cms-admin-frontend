import { graphql } from "./generated/gql"

export const ME_QUERY = graphql(`
  query QueryMe {
    meQuery {
      isSignedIn
      user {
        id
        username
        email
        profile {
          id
          lastName
          firstName
          avatar
        }
      }
    }
  }
`)

export const HOME_PAGE_QUERY = graphql(`
  query TestConnection {
    __schema {
      types {
        name
      }
    }
    meQuery {
    isSignedIn
      user {
      id
        profile {
        id
          firstName
        }
      }
    }
    adminArticles {  
    id
    slug
    createdAt
    title
    status
    updatedAt
    author {
      id
      role
      username
      profile {
        id
        avatar
        }
      }
    }
    adminProducts {
    id
    isActive
    }
    teamMembers {
    id
    }
    inquiries {
    id
    name
    message
    status
    createdAt
    }
  }
`);

export const POSTS_PAGE_QUERY = graphql(`
  query getPosts {
    categories {
    id
    name
  }    
    adminArticles {
    id
    createdAt
    title
    status
    updatedAt
    slug
    author {
      username
      profile {
        avatar
        }
      }
    category {
      id
      name
    }
    media {
      id
      url
    }
    }
  }
`);

export const INQUIRIES_PAGE_QUERY = graphql(`
  query getInquiries {
    inquiries {
    id
    name
    message
    status
    createdAt
  }
}
`);

export const PRODUCTS_PAGE_QUERY = graphql(`
  query getProducts {
    adminProducts {
    id
    isActive
    name
    description
    updatedAt
    createdAt
    category {
      id
      name
    }
  }
    categories {
    id
    name
  }
}
`);

export const TEAM_PAGE_QUERY = graphql(`
  query getTeamMembers {
    teamMembers {
    id
    name
    image
    position
    socials
  }
}
`);

export const TESTIMONIES_PAGE_QUERY = graphql(`
  query AdminTestimonies {
  adminTestimonies {
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
`)

export const GALLERIES_PAGE_QUERY = graphql(`
  query AdminGalleries {
  adminGalleries {
    id
    title
    createdAt
    updatedAt
    status
    media {
    id
    url
    }
  }
}
`)

export const GET_GALLERY_BY_ID = graphql(`
  query AdminGallery($id: String!) {
  adminGallery(id: $id) {
    id
    title
    status
    media {
      id
      url
    }
    createdAt
    updatedAt
  }
}
`)

export const SETTINGS_PAGE_QUERY = graphql(`
  query getSettings {
  companyProfile {
    id
    address
    email
    phone
    socials
  }
}
`)

export const GET_ARTICLE_BY_ID = graphql(`
  query getArticleById($id: String!) {
    categoriesAdmin {
    id
    name
    description
    }
    adminArticle(id: $id) {
    id
    category {
      name
      id
    }
    updatedAt
    content
    slug
    title
    excerpt
    status
    media {
    id
    url
    }
    }
  }
`);

export const GET_ALL_CATEGORIES = graphql(`
  query getAllCategories {
    categoriesAdmin {
    id
    name
    description
  }
}
`);

export const GET_INQUIRY_BY_ID = graphql(`
  query getInquiryById($inquiryId: String!) {
    inquiry(id: $inquiryId) {
    id
    createdAt
    email
    message
    name
    phone
    status
  }
}
`)

export const GET_PRODUCT_BY_ID = graphql(`
  query AdminProduct($adminProductId: String!) {
    categoriesAdmin {
    id
    name
    description
    }
    adminProduct(id: $adminProductId) {
    id
    category {
      id
      name
    }
    icon
    name
    tagline
    description
    isActive
    media {
    id
    url
    }
    createdAt
    updatedAt
    slug
    order
  }
}
`)

export const GET_TESTIMONY_BY_ID = graphql(`
  query AdminTestimony($adminTestimonyId: String!) {
    adminTestimony(id: $adminTestimonyId) {
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
`)


