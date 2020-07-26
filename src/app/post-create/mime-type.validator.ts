import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

export const mimeType = (
  control: AbstractControl
  ): Promise<{[key:string]: any}> | Observable<{[key:string]: any}> => {
  const FILE = control.value as File;
  const FILE_READER = new FileReader();
  const FR_OBSERVABLE = Observable.create((observer: Observer<{[key:string]: any}>) => {
    FILE_READER.addEventListener("loadend", () => {
      const ARR = new Uint8Array(FILE_READER.result as ArrayBuffer).subarray(0,4);
      let header = "";
      let isValid = false;
      for(let i=0; i<ARR.length; i++) {
        header += ARR[i].toString(16);
      }
      switch(header) {
        case "89504e47":
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
      }
      if(isValid) {
        observer.next(null);
      } else {
        observer.next({invalidMimeType: true});
      }
      observer.complete();
    });
    FILE_READER.readAsArrayBuffer(FILE);
  });
  return FR_OBSERVABLE;
}
