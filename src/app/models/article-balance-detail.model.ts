export class ArticleBalanceDetail {
    public articleIds: number[];
    public supplierArticleIds: number[];

    constructor(articleId?: number[], supplierArticleIds?: number[]) {
        this.articleIds = articleId;
        this.supplierArticleIds = supplierArticleIds;
    }
}