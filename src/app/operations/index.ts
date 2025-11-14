import { gql } from 'apollo-angular';

export const CONTENT_FRAGMENT = gql`
    fragment ArticleContent on ContentType {
        version
        time
        blocks {
            id
            type
            data
        }
    }
`;

export const TRANSLATION_FRAGMENT = gql`
    fragment ArticleTranslations on TranslationType {
        language
        header
        content {
            ...ArticleContent
        }
        is_published
        published_at
        category {
            id
            name
        }
        tags {
            id
            name
        }
    }
    ${CONTENT_FRAGMENT}
`;

export const GET_ARTICLES = gql`
    query articles(
        $entityName: EntityEnum
        $filterInput: ArticlesFilterInputType
        $sortInput: [SortInputType!]
        $limit: Int
        $skip: Int
    ) {
        articles(filter_input: $filterInput, sort_input: $sortInput, limit: $limit, skip: $skip) {
            id
            translations {
                ...ArticleTranslations
            }
            slug
            priority
            created_at
            updated_at
        }
        count(entity: $entityName) {
            count
            entity
        }
    }
    ${TRANSLATION_FRAGMENT}
`;

// Cache
export const READ_ARTICLE = gql`
    query ReadArticle($id: ID!) {
        article(id: $id) {
            id
            translations {
                ...ArticleTranslations
            }
            slug
            priority
        }
    }
    ${TRANSLATION_FRAGMENT}
`;
