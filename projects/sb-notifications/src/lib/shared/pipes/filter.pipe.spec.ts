import { FilterPipe } from "./filter.pipe";

describe('FilterPipe', () => {
  let pipe: FilterPipe;

  beforeEach(() => {
    pipe = new FilterPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array if items is null', () => {
    const result = pipe.transform([], 'search', 'fieldName');
    expect(result).toEqual([]);
  });

  it('should return items if searchText is null', () => {
    const items = [{ fieldName: 'value1' }, { fieldName: 'value2' }];
    const result = pipe.transform(items, '', 'fieldName');
    expect(result).toEqual(items);
  });

  it('should filter items based on searchText and fieldName', () => {
    const items = [
      { fieldName: 'value1' },
      { fieldName: 'value2' },
      { fieldName: 'value3' },
    ];
    const result = pipe.transform(items, 'value1', 'fieldName');
    expect(result).toEqual([{ fieldName: 'value1' }]);
  });

  it('should return empty array if fieldName is not present in items', () => {
    const items = [{ otherField: 'value' }];
    const result = pipe.transform(items, 'value', 'fieldName');
    expect(result).toEqual([]);
  });

  it('should return empty array if item[fieldName] is null', () => {
    const items = [{ fieldName: null }];
    const result = pipe.transform(items, 'value', 'fieldName');
    expect(result).toEqual([]);
  });
});
