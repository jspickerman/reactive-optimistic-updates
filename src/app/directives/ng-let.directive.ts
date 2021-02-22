import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface LetContext<T> {
  appNgLet: T;
}

@Directive({
  selector: '[appNgLet]'
})
export class NgLetDirective<T> {

  private context: LetContext<T> = {appNgLet: null};

  constructor(_viewContainer: ViewContainerRef, _templateRef: TemplateRef<LetContext<T>>) {
    _viewContainer.createEmbeddedView(_templateRef, this.context);
  }

  @Input()
  set appNgLet(value: T) {
    this.context.appNgLet = value;
  }
}
