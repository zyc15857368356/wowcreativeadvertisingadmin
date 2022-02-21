<template>
  <div class="user-box">
    <el-row>
      <el-col :span="24">
        <div class="tool-box">
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            size="small"
            @click="handleAdd"
            >新增</el-button
          >
          <div style="display: flex">
            <el-input
              v-model="search"
              size="small"
              style="width: 200px; margin-right: 5px"
            ></el-input>
            <el-button size="small" @click="getData" type="primary"
              >搜索</el-button
            >
          </div>
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="videos"
      border
      @selection-change="selectChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="Path" label="视频"> </el-table-column>
      <el-table-column prop="Cover" label="视频封面"> </el-table-column>
      <el-table-column prop="Titel" label="视频标题"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="viewDetail(scope.$index, scope.row)"
            >详情</el-button
          >
          <el-button
            size="small"
            type="primary"
            v-if="!scope.row.Recomd"
            @click="recommendOrNot(scope.row)"
            >推荐</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="recommendOrNot(scope.row)"
            v-else
            >取消推荐</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: flex-end">
      <el-pagination
        :current-page="page.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="page.row"
        :size-change="sizeChange"
        :current-change="currentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="dialogTitle"
      width="600px"
      :visible.sync="userFormVisible"
      @close="resetForm('userForm')"
    >
      <el-form :model="videoEdit" ref="userForm">
        <el-form-item label="视频上传" prop="path" label-width="100px">
          <el-upload
            class="upload-demo"
            ref="videoUpload"
            :on-remove="videoRemove"
            action=""
            :http-request="uploadFile"
            :on-success="uploadSuccess"
            :before-remove="beforeRemove"
            :limit="1"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传视频文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="封面上传" label-width="100px">
          <el-upload
            ref="pictures"
            action="#"
            class="avatar-uploader"
            list-type="picture-card"
            :http-request="uploadimg"
            :limit="1"
          >
            <img
              v-if="videoEdit.Cover"
              :src="fileUrl + videoEdit.Cover"
              class="avatar"
            />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="视频标题" label-width="100px">
          <el-input v-model="videoEdit.Titel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" label-width="100px">
          <el-input v-model="videoEdit.Price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="网址链接" label-width="100px">
          <el-input v-model="videoEdit.Link" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="详情"
      width="800px"
      :visible.sync="detailVisible"
      :before-close="detailClose"
      :show-close="false"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="收藏" name="first">
          <el-table :data="collectionobj" style="width: 100%">
            <el-table-column prop="UserName" label="用户名"> </el-table-column>
            <el-table-column prop="Tel" label="手机号"> </el-table-column>
            <el-table-column prop="Emile" label="邮箱"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="分享" name="second">
          <el-table :data="shareobj" style="width: 100%">
            <el-table-column prop="UserName" label="用户名"> </el-table-column>
            <el-table-column prop="Tel" label="手机号"> </el-table-column>
            <el-table-column prop="Emile" label="邮箱"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="点赞" name="third">
          <el-table :data="thumobj" style="width: 100%">
            <el-table-column prop="UserName" label="用户名"> </el-table-column>
            <el-table-column prop="Tel" label="手机号"> </el-table-column>
            <el-table-column prop="Emile" label="邮箱"> </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer">
        <el-button size="mini" @click="close" type="primary">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "first",
      detailVisible: false,
      MemberId: localStorage.getItem("MemberId"),
      Role: localStorage.getItem("Role"),
      fileList: [],
      videos: [],
      videoEdit: {
        Cover: "",
        Titel: "",
        Price: "",
        path: "",
        Link: "",
      },
      collectionobj: [],
      shareobj: [],
      thumobj: [],
      userBackup: Object.assign({}, this.user),
      multipleSelection: [],
      userFormVisible: false,
      dialogTitle: "",
      rowIndex: 9999,
      // 图片上传
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      page: {
        page: 1,
        row: 20,
        total: 0,
      },
      search: "",
      files: null,
      fileUrl: "http://124.71.148.15:8004/Data/",
      id: null,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    handleClick() {
      console.log(this.thumobj);
    },
    close() {
      this.collectionobj = [];
      this.shareobj = [];
      this.thumobj = [];
      this.detailVisible = false;
    },
    detailClose() {
      this.activeName = "first";
      this.$refs.detailForm.dialog = false;
    },
    viewDetail(e, s) {
      this.http
        .get("/Admin/Home/GetVideoBehavior", { id: s.Id })
        .then((res) => {
          if (res.data.Success) {
            this.collectionobj = res.data.Data.collectionobj.collection;
            this.shareobj = res.data.Data.shareobj.share;
            this.thumobj = res.data.Data.thumobj.thumb;
            this.detailVisible = true;
          }
        })
        .catch((res) => {
          this.$message({
            message: res.data.Message,
            type: "error",
          });
        });
    },
    recommendOrNot(e) {
      this.http.post("/Admin/Home/RecomdVideo", { id: e.Id }).then((res) => {
        if (res.data.Success) {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.getData();
        } else {
          this.$message({
            message: res.data.Message,
            type: "error",
          });
        }
      });
    },
    uploadimg(e) {
      var formdata = new FormData();
      formdata.append("files", e.file);
      this.http
        .post("/Admin/Home/UploadImage", formdata)
        .then((res) => {
          if (res.data.Success) {
            this.videoEdit.Cover = res.data.Data;
          }
        })
        .catch((res) => {
          this.$message({
            message: res.data.Message,
            type: "error",
          });
        });
    },
    uploadFile(e) {
      var formdata = new FormData();
      formdata.append("files", e.file);
      this.http
        .post("/Admin/Home/UploadVideo", formdata)
        .then((res) => {
          if (res.data.Success) {
            this.fileList = [];
            this.fileList.push({
              name: this.fileUrl + res.data.Data,
            });
            this.videoEdit.path = res.data.Data;
          } else {
            this.videoEdit.path = "";
          }
        })
        .catch((res) => {
          this.$message({
            message: res.data.Message,
            type: "error",
          });
        });
    },
    uploadChange(e) {
      console.log(e);
    },
    uploadSuccess(e) {
      console.log(e);
    },
    currentChange(e) {
      this.page.page = e;
      this.getData();
    },
    sizeChange(e) {
      this.page.row = e;
      this.getData();
    },
    beforeRemove() {},
    videoRemove() {},
    getData() {
      this.loading = true;
      this.http
        .get(
          "/Admin/Home/GetVideo?pageIndex=" +
            this.page.page +
            "&pageSize=" +
            this.page.row +
            "&search=" +
            this.search +
            "&MemberId=" +
            this.MemberId +
            "&Role=" +
            this.Role
        )
        .then((res) => {
          if (res.data.Success) {
            this.videos = res.data.Data;
          }
        })
        .catch((res) => {
          this.$message({
            message: res.data.Message,
          });
        });
    },
    handleEdit(index, row) {
      this.dialogTitle = "编辑";
      this.id = row.Id;
      this.videoEdit = {
        Cover: row.Cover,
        Titel: row.Titel,
        Price: row.Price,
        Path: row.Path,
        Link: row.Link,
      };
      console.log(this.videoEdit);
      this.fileList.push({
        name: this.fileUrl + row.Path,
      });
      this.userFormVisible = true;
    },
    submitUser() {
      for (let key in this.videoEdit) {
        if (!this.videoEdit[key]) {
          return this.$message({
            message: "请填写完整",
            type: "warning",
          });
        }
      }
      var obj = {
        Cover: this.videoEdit.Cover,
        Titel: this.videoEdit.Titel,
        Price: this.videoEdit.Price,
        Path: this.videoEdit.path,
        Link: this.videoEdit.Link,
      };
      if (this.id) {
        obj.id = this.id;
        this.http
          .post("/Admin/Home/EditVideo", obj)
          .then((res) => {
            if (res.data.Success) {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.videoEdit = {
                Cover: "",
                Titel: "",
                Price: "",
                path: "",
              };
              this.getData();
              this.userFormVisible = false;
              obj = {};
            } else {
              this.$message({
                message: res.data.Message,
                type: "error",
              });
            }
          })
          .catch((res) => {
            this.$message({
              message: res.data.Message,
              type: "error",
            });
          });
      } else {
        this.http
          .post("/Admin/Home/AddVideo", obj)
          .then((res) => {
            if (res.data.Success) {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.videoEdit = {
                Cover: "",
                Titel: "",
                Price: "",
                path: "",
              };
              this.getData();
              this.userFormVisible = false;
            } else {
              this.$message({
                message: res.data.Message,
                type: "error",
              });
            }
          })
          .catch((res) => {
            this.$message({
              message: res.data.Message,
              type: "error",
            });
          });
      }
    },
    delVideo(e) {
      let ids = [e];
      console.log(2);
      this.http
        .post("/Admin/Home/DelVideo", ids)
        .then((res) => {
          if (res.data.Success) {
            this.getData();
          }
        })
        .catch((res) => {
          console.log(res);
        });
    },
    handleDelete(e, s) {
      this.$confirm("确定删除该视频吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(12313131);
          this.delVideo(s.Id);
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    resetForm() {
      this.fileList = [];
      this.videoEdit = {
        Cover: "",
        Titel: "",
        Price: "",
        Path: "",
        Link: "",
      };
    },

    mulDelete() {
      let len = this.multipleSelection.length;
      if (len === 0) {
        this.$message({
          type: "warning",
          message: "请至少选择一项！",
        });
      } else {
        this.$confirm(`确定删除选中的 ${len} 个用户吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$message({
              type: "success",
              message: `成功删除了${len}条数据！`,
            });
          })
          .catch(() => {
            console.log("取消删除");
          });
      }
    },
    selectChange(val) {
      this.multipleSelection = val;
    },
    // 新增
    handleAdd() {
      this.dialogTitle = "新增";
      this.videoEdit = Object.assign({}, this.userBackup);
      this.userFormVisible = true;
    },

    handleRemove() {
      this.videoEdit.Cover = "";
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
  },
};
</script>

<style scoped>
.user-box {
  width: 100%;
}
.tool-box {
  padding: 10px 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}
.el-pagination {
  margin-top: 20px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.avatar {
  width: 50px;
  height: 50px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
