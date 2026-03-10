import { graphql } from "./generated/gql"

export const HOME_PAGE_QUERY = graphql(`
  query TestConnection {
    __schema {
      types {
        name
      }
    }
    adminArticles {  
    id
    createdAt
    title
    status
    updatedAt
    author {
      username
      profile {
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
    }
  }
`);

export const INQUIRIES_PAGE_QUERY = graphql(`
  query getInquiries {
    inquiries {
    id
    name
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

export const GET_ARTICLE_BY_ID = graphql(`
  query getArticleById($id: String!) {
    categories {
      id
      name
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
    categories {
    id
    name
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
    categories {
      id
      name
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

