import { Part } from './part.model';

export class PartList {
    Parts: Array<Part> = new Array<Part>();
    isValid = (): boolean => {
        if (this.Parts.length <= 0)
            return false;

        return !this.Parts.some(p => !p.isValid());
    };
    addPart = (): void => {
        if (!this.Parts) {
            this.Parts = new Array<Part>();
        }

        this.Parts.push(new Part());
    }

    removePart = (index: number): void => {
        this.Parts.splice(index, 1);
    }

    removeInvalidPart = (): void => {
        if (this.Parts.length == 1 && this.Parts[0].BrandCodeName == null)
            this.removePart(0);
    }
}