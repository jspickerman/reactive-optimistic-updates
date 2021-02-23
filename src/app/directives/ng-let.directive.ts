import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface LetContext<T> {
  appNgLet: T;
}

@Directive({
  selector: '[appNgLet]'
})
export class NgLetDirective<T> {

  private context: LetContext<T> = {appNgLet: null};

  constructor(viewContainer: ViewContainerRef, templateRef: TemplateRef<LetContext<T>>) {
    viewContainer.createEmbeddedView(templateRef, this.context);
  }

  @Input()
  set appNgLet(value: T) {
    this.context.appNgLet = value;
  }
}
