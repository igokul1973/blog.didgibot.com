import { gql } from 'apollo-angular';

export const GET_ARTICLES = gql`
    query articles($filterInput: ArticlesFilterInputType, $sortInput: [SortInputType!], $limit: Int, $skip: Int) {
        articles(filter_input: $filterInput, sort_input: $sortInput, limit: $limit, skip: $skip) {
            id
            translations {
                language
                header
                content {
                    version
                    time
                    blocks {
                        id
                        type
                        data
                    }
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
            created_at
            updated_at
        }
    }
`;
