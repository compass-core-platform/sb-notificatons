import { Component, DebugElement } from '@angular/core';
import { ImageFile, ImageUploadDirective } from './image-upload.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe('ImageUploadDirective', () => {
  @Component({
    template: `
      <div libImageUpload></div>
    `,
  })
  class TestComponent {
    droppedFiles: ImageFile[] = [];

    onDropFiles(files: ImageFile[]): void {
      this.droppedFiles = files;
    }
  }

  let fixture: ComponentFixture<TestComponent>;
  let testComponent: TestComponent;
  let directiveElement: DebugElement;
  let directive: ImageUploadDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ImageUploadDirective],
    });

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(ImageUploadDirective));
    directive = fixture.debugElement.query(By.directive(ImageUploadDirective)).injector.get(ImageUploadDirective);
  });
  
  it('should create an instance', () => {
    const directive = new ImageUploadDirective();
    expect(directive).toBeTruthy();
  });

  it('should prevent default and stop propagation on dragover event', () => {
    const dragOverEvent = createMockDragOverEvent();
    
    directiveElement.triggerEventHandler('dragover', dragOverEvent);

    expect(dragOverEvent.preventDefault).toHaveBeenCalled();
    expect(dragOverEvent.stopPropagation).toHaveBeenCalled();
  });

  function createMockDragOverEvent(): DragEvent {
    const event = createMockEvent('dragover');
    spyOn(event, 'preventDefault');
    spyOn(event, 'stopPropagation');
    return event;
  }

  function createMockEvent(type: string): DragEvent {
    return new DragEvent(type);
  }
  function createGenericMockEvent(type: string): Event {
    return new Event(type);
  }

  it('should prevent default and stop propagation on dragleave event', () => {
    const dragLeaveEvent = createMockDragLeaveEvent();

    directiveElement.triggerEventHandler('dragleave', dragLeaveEvent);
  
    expect(dragLeaveEvent.preventDefault).toHaveBeenCalled();
    expect(dragLeaveEvent.stopPropagation).toHaveBeenCalled();
  });
  
  function createMockDragLeaveEvent(): DragEvent {
    const event = createMockEvent('dragleave');
    spyOn(event, 'preventDefault');
    spyOn(event, 'stopPropagation');
    return event;
  }

  it('should prevent default and stop propagation on drop event', () => {
    const dropEvent = createMockDropEvent();
    
    directiveElement.triggerEventHandler('drop', dropEvent);
  
    expect(dropEvent.preventDefault).toHaveBeenCalled();
    expect(dropEvent.stopPropagation).toHaveBeenCalled();
  });
  
  it('should not emit dropFiles event when no files are dropped', () => {
    const dropEvent = createMockDropEvent();
    spyOn(dropEvent.dataTransfer as any, 'files').and.returnValue([]);

    directiveElement.triggerEventHandler('drop', dropEvent);
  
    expect(testComponent.droppedFiles.length).toBe(0);
  });
  
  function createMockDropEvent(): DragEvent {
    const event = createGenericMockEvent('drop');
    spyOn(event, 'preventDefault');
    spyOn(event, 'stopPropagation');
    Object.defineProperty(event, 'dataTransfer', {
      get: () => ({
        files: [new File(['content'], 'file1.txt'), new File(['content'], 'file2.txt')],
        types: ['Files'],
      }),
    });
  
    return event as DragEvent;
  }
  
  

});
