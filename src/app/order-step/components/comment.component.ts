import { Component, Output, EventEmitter, Inject, OnInit} from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { OrderStepService } from '../order-step.service';

@Component({
    selector: 'comment',
    templateUrl: './__mobile__/comment.component.html'
})
export class CommentComponent implements OnInit {
    displayComment: boolean = false;

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        public _orderStepService: OrderStepService) { }

    @Output() onCommentEdit: EventEmitter<string> = new EventEmitter<string>();

    ngOnInit() {
        this.displayComment = !!this._orderStepService.OrderStepMainModel.ContactInfo.Comment;
    }

    onCommentChange(value: string) {
        this.onCommentEdit.emit(value);
    }

    public onDisplayCommentClick(): void {
        this.displayComment = true;
    }

    public displayCommentBlock(): string {
        if (this.displayComment)
            return this._constants.STYLING.COMMENT_HEIGHT_DISPLAY;

        return this._constants.STYLING.COMMENT_HEIGHT_O;
    }
}



