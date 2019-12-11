import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/shared/user.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { ApplicationUserModel } from 'src/app/models/application-user.model';
import { Observable, Subject, of, concat} from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-send-message-modal',
  templateUrl: './send-message-modal.component.html',
  styleUrls: ['./send-message-modal.component.css']
})
export class SendMessageModalComponent implements OnInit {

    @ViewChild('myInput', { static: false }) myInput: ElementRef;

  people$: Observable<any>;
  peopleLoading = false;
  peopleInput$ = new Subject<string>();
  selectedPersons: ApplicationUserModel[] = [] as any;

  constructor(private service: UserService, private apiService: ApiService) { }

  ngOnInit() {
      this.loadPeople();
  }

  trackByFn(item: ApplicationUserModel) {
        return item.id;
  }
   private loadPeople() {
        this.people$ = concat(
            of([]), // default items
            this.peopleInput$.pipe(
                distinctUntilChanged(),
                tap(() => this.peopleLoading = true),
                switchMap(term => this.service.getSearchFriend(term).pipe(
                    catchError(() => of([])), // empty list on error
                    tap(() => this.peopleLoading = false)
                ))
            )
        );
    }

    sendNewTextMessage() {
        this.apiService.sendNewGroupMessage(this.selectedPersons.map(p => p.id), this.myInput.nativeElement.value).subscribe();
        this.purge();
    }

    private purge() {
        this.myInput.nativeElement.value = '';
        this.selectedPersons = [];
    }
}
