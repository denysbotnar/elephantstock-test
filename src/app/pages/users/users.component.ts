import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IUser, UserService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: IUser[] = [];
  roles = {
    1: 'Artist',
    2: 'Designer',
    3: ' Art manager',
  };

  modalModeList = {
    STORE: 1,
    UPDATE: 2,
  };

  Object = Object;
  roleId: number;
  search: string;
  errors: any;
  modalMode: number;
  editId: string;

  userForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    roleId: new FormControl(null, [Validators.required]),
  });

  constructor(private userService: UserService, private modalService: NgbModal) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers(data?: any): void {
    this.userService.getAll(data).subscribe(({ data }: any) => {
      this.users = data;
    });
  }

  handleRoleChange(ev: any): void {
    this.roleId = +ev.target.value;
    this.getUsers(this.getSearchParams());
  }

  handleSearchChange(ev: Event): void {
    this.search = (ev.target as HTMLInputElement).value;
    this.getUsers(this.getSearchParams());
  }

  handleSearchClick(): void {
    this.getUsers(this.getSearchParams());
  }

  handleAddNewClick(content: any): void {
    this.modalMode = this.modalModeList.STORE;
    this.modalService.open(content);
  }

  handleStoreSubmit(): void {
    if (!this.userForm.valid) {
      return this.validateAllInputs();
    }

    this.errors = null;
    this.userService
      .store({
        ...this.userForm.value,
        roleId: +this.userForm.value.roleId,
      })
      .subscribe(
        ({ data }: any) => {
          this.users.push(data);
          this.modalService.dismissAll();
          this.userForm.reset();
        },
        (e) => this.errorHandler(e)
      );
  }

  handleUpdateClick(id: string, content: any): void {
    this.modalMode = this.modalModeList.UPDATE;
    this.editId = id;
    const user = this.users.find((user) => user._id === id);
    if (user) {
      this.userForm.setValue({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        roleId: user.roleId,
      });
      this.modalService.open(content);
    }
  }

  handleUpdateSubmit(): void {
    if (this.userForm.valid) {
      this.errors = null;
      this.userService
        .updateById(this.editId, {
          ...this.userForm.value,
          roleId: +this.userForm.value.roleId,
        })
        .subscribe(
          ({ data }) => {
            this.users = this.users.map((user) => {
              if (user._id === this.editId) {
                user = data;
              }

              return user;
            });
            this.modalService.dismissAll();
            this.userForm.reset();
          },
          (e) => this.errorHandler(e)
        );
    } else {
      this.validateAllInputs();
    }
  }

  handleDestroyClick(id: string): void {
    this.userService.destroyById(id).subscribe(() => {
      this.users = this.users.filter((user) => user._id !== id);
    });
  }

  protected getSearchParams() {
    let params: any = {};

    if (this.roleId) {
      params.roleId = this.roleId;
    }

    if (this.search) {
      params.search = this.search;
    }

    return params;
  }

  isFieldValid(field: string): boolean {
    return this.userForm.get(field).invalid && (this.userForm.get(field).dirty || this.userForm.get(field).touched);
  }

  getSubmitHandler() {
    return this.modalMode === this.modalModeList.STORE ? this.handleStoreSubmit() : this.handleUpdateSubmit();
  }

  protected errorHandler(e: any): void {
    if (e.error.errors && e.status === 400) {
      this.errors = Object.keys(e.error.errors).reduce((acc: any, curr: any) => {
        acc = [...acc, ...e.error.errors[curr]];

        return acc;
      }, []);
    } else {
      this.errors = [{ message: e.error.error }];
    }
  }

  protected validateAllInputs(): void {
    Object.keys(this.userForm.controls).map((field) => {
      const control = this.userForm.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }
}
