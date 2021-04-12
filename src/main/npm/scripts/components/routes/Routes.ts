export const Routes = {
    error: () => {
        return {
            pathname: '/error',
        };
    },
    index: () => {
        return {
            pathname: '/',
        };
    },
    example: (query?: string, page?: number) => {
        return {
            pathname: '/example',
            query: {
                query: query == null ? '' : query,
                page: page == null ? '0' : page.toString(),
            },
        };
    },
    sample: (query?: string, page?: number) => {
        return {
            pathname: '/sample',
            query: {
                query: query == null ? '' : query,
                page: page == null ? '0' : page.toString(),
            },
        };
    },
};