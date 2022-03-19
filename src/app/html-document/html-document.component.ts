import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-html-document',
  templateUrl: './html-document.component.html',
  styleUrls: ['./html-document.component.css']
})
export class HtmlDocumentComponent implements OnInit {
  showAddButton: boolean = true;
  htmlDocs: any[] = [];
  currentDocId: number = 0;
  loading: boolean = false;
  loginButtonShow: boolean = false;
  constructor(private router: Router ,private _sharedService: SharedService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.loading = true;
    this.getAllDocs();
  }
  getAllDocs() {
    this._sharedService.getAllDocuments().subscribe((res: any) => {
      this.htmlDocs = res.data;
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      if (err.status == 401) {
        this.loginButtonShow = true;
        this.messageService.add({ severity: 'error', summary: 'Unauthorized', detail: 'You should login again because your session has finished' });
        this.router.navigate(['/login']);
      }
    });
  }
  onClickLogout(e:any){
    localStorage.clear();this.router.navigate(['/home']);
  }
  afterCloseDocument(e: any) {
    this.getAllDocs();
    this.showAddButton = !this.showAddButton;
  }
  onClickDelete(id: any) {
    this.loading = true;
    this._sharedService.delete(id).subscribe((res: any) => {
      this.messageService.add({ severity: 'success', summary: 'Successfully deleted', detail: 'The document deleted' });
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      if (err.status == 401) {
        this.loginButtonShow = true;
        this.messageService.add({ severity: 'error', summary: 'Unauthorized', detail: 'You should login again because your session has finished' });
      }
    });
  }
  onClickEdit(id: any) {
    this.currentDocId = id;
    this.showAddButton = !this.showAddButton;
  }
}
