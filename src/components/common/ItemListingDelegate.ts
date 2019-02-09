interface IDable {
    _id: string
}

export interface ItemListingState<U extends IDable> {
    items: U[]
    hasMore: boolean
}

interface ItemListingCallbacks<T extends IDable> {
    loadMore: (lastDisplayed?: string) => Promise<T[]>
    setState: (newState: ItemListingState<T>) => void
}

export class ItemListingDelegate<T extends IDable> {
    private loadInProgress = false
    private state: ItemListingState<T>

    constructor(private callbacks: ItemListingCallbacks<T>) {
        this.state = {
            items: [],
            hasMore: true
        }
    }

    public loadMore = () => {
        if(this.loadInProgress) {
            return
        }

        let lastDisplayed = undefined
        if(this.state.items.length > 0) {
            lastDisplayed = this.state.items[this.state.items.length - 1]._id
        }

        this.loadInProgress = true
        this.callbacks.loadMore(lastDisplayed).then((items: T[]) => {
            this.loadInProgress = false
            const newItems = this.state.items.slice().concat(items)
            this.state = {items: newItems, hasMore: items.length > 0}
            this.callbacks.setState(this.state)
        })
    }

    public deleteItem = (item: T) => {
        const newItems = this.state.items.slice(0)
        
        const index = this.indexOfArticleInArray(item, newItems)
        if(index >= 0) {
            newItems.splice(index, 1)
        }
        this.callbacks.setState({items: newItems, hasMore: this.state.hasMore})
        return newItems
    }

    private indexOfArticleInArray(article: T, items: T[]): number {
        const art = items.find(item => item._id === article._id)
        if(art) {
            return items.indexOf(art)
        }
        return -1
    }

    public updateItem = (item: T) => {
        const index = this.indexOfArticleInArray(item, this.state.items)
        if(index >= 0) {
            this.callbacks.setState({
                items: [...this.state.items.slice(0, index), item, ...this.state.items.slice(index + 1)], 
                hasMore: this.state.hasMore
            })
        }
    }
}