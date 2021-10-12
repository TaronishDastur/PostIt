import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { take } from 'rxjs/operators';
import { MODIFY_POST } from 'src/app/shared/constants';
import { PostService } from '../post.service';

@Component({
  selector: 'app-create-edit-post',
  templateUrl: './create-edit-post.component.html',
  styleUrls: ['./create-edit-post.component.scss'],
})
export class CreateEditPostComponent implements OnInit {
  MODIFY_POST = MODIFY_POST;
  mode: number;
  loading = false;
  private id: string;
  form = new FormGroup({
    title: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    content: new FormControl(null, [Validators.required]),
    image: new FormControl(null, [this.fileTypeValidator()]),
    imageThumbnail: new FormControl(null, [Validators.required]),
  });

  constructor(
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loading = true;
    this.route.paramMap.pipe(take(1)).subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = this.MODIFY_POST.EDIT;
        this.id = paramMap.get('id');
        this.postService
          .getPostById(this.id)
          .pipe(take(1))
          .subscribe((data) => {
            this.form.patchValue({
              title: data.post.title,
              content: data.post.content,
              imageThumbnail: `data:${
                data.post.image['contentType']
              };base64,${data.post.image['data'].toString('base64')}`,
              image: null,
            });
            this.loading = false;
          });
      } else {
        this.loading = false;
        this.mode = this.MODIFY_POST.ADD;
        this.id = null;
      }
    });
  }

  onSave() {
    if (!this.form.invalid) {
      this.mode === 1
        ? this.postService.addPost(
            this.form.controls.title.value,
            this.form.controls.content.value,
            this.form.controls.image.value
          )
        : this.mode === 2
        ? this.postService.updatePost(
            this.id,
            this.form.controls.title.value,
            this.form.controls.content.value,
            this.form.controls.image?.value
          )
        : null;
      this.form.reset;
    }
  }

  onFileAdded(target: HTMLInputElement) {
    this.form.controls.image.patchValue(target.files[0]);
    this.form.controls.image.updateValueAndValidity();
    if (this.form.controls.image.valid) {
      const reader = new FileReader();
      reader.onload = () =>
        this.form.controls.imageThumbnail.setValue(reader.result as string);
      reader.readAsDataURL(this.form.controls.image.value);
    }
  }

  fileTypeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fileType = control.value?.type;
      return !fileType || fileType?.includes('image')
        ? null
        : { incorrectType: fileType };
    };
  }
}
