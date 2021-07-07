import { GenericFilterModel } from '../../filters/models/generic-filter.model';

export class DropdownFilterModel extends GenericFilterModel{    
    isActive?: boolean = true;
    dropdownShown?: boolean = false; 
    placeholder: string;
}