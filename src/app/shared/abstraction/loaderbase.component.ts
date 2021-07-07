export class BaseLoader {
    public inProcess: boolean = false;

    protected StartSpinning() {
        this.inProcess = true;
    }

    protected EndSpinning() {
        this.inProcess = false;
    }
}