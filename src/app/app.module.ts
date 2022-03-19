import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DropdownModule} from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {DragDropModule} from '@angular/cdk/drag-drop';
// Imported Syncfusion RichTextEditorModule from Rich Text Editor package
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { SafeHtmlPipe } from './safe-html.pipe';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSliderModule} from '@angular/material/slider';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {ColorPickerModule} from 'primeng/colorpicker';
import { API_BASE_URL, AppHttpInterceptor, SharedService, UserService } from './shared.service';
import { environment } from 'src/environments/environment';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './account/login/login.component';
import {ToastModule} from 'primeng/toast';
import { HtmlDocumentComponent } from './html-document/html-document.component';
import { MessageService } from 'primeng/api';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import { HtmlDocumentViewComponent } from './html-document/html-document-view/html-document-view.component';
import { RegisterComponent } from './account/register/register.component';
@NgModule({
  declarations: [
    AppComponent,
    SafeHtmlPipe,
    HomeComponent,
    LoginComponent,
    HtmlDocumentComponent,
    HtmlDocumentViewComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    DragDropModule,
    ToastModule,
    InputTextModule,
    // Registering EJ2 Rich Text Editor Module
    RichTextEditorModule,
    DropdownModule,
    InputNumberModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatSliderModule,
    ColorPickerModule,
    ProgressSpinnerModule
  ],
  providers: [
    {
      provide: API_BASE_URL,
      useValue: environment.apiRoot
   },
   
   { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
   UserService,
   MessageService,
   SharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
