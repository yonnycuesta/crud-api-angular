import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'Nombre',
    'Categoria',
    'Freshness',
    'Precio',
    'Fecha',
    'Acciones',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
  }
  constructor(public dialog: MatDialog, private api: ApiService) {}

  ngOnInit() {
    this.getAllProducts();
  }
  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '34%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllProducts();
        }
      });
  }

  getAllProducts() {
    this.api.getProduct().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(res);
      },
      error: () => {
        console.log('Error');
      },
    });
  }

  editProduct(element: any) {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
        data: element,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllProducts();
        }
      });
  }
  deleteProduct(id: number) {
    this.api.deleteProduct(id).subscribe({
      next: (res) => {
        console.log('Producto Eliminado');
        this.getAllProducts();
      },
      error: () => {
        console.log('Error');
      },
    });
  }
}
