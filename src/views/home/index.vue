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
      <el-table-column prop="video" label="视频"> </el-table-column>
      <el-table-column prop="videoCover" label="视频封面"> </el-table-column>
      <el-table-column prop="videoTitle" label="视频标题"> </el-table-column>
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
          <el-button size="small" type="primary">推荐</el-button>
          <el-button size="small" type="primary">取消推荐</el-button>
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
        <el-form-item label="视频上传" prop="name" label-width="100px">
          <el-upload
            class="upload-demo"
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
            list-type="picture-card"
            :http-request="uploadimg"
            :limit="1"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>

                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="视频标题" label-width="100px">
          <el-input v-model="videoEdit.Titel" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser('userForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      MemberId: localStorage.getItem("MemberId"),
      Role: localStorage.getItem("Role"),
      fileList: [],
      videos: [],
      videoEdit: {
        id: "",
        video: "",
        videoCover: "",
        Titel: "",
      },
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
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    uploadimg(e) {
      var formdata = new FormData();
      formdata.append("files", e.file);
      this.http
        .post("/Admin/Home/UploadImage", formdata)
        .then((res) => {
          if (res.data.Success) {
            console.log(res);
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
      console.log(1111, e);
      this.files = new FormData();
      this.files.append(e.file);
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
      this.videoEdit = Object.assign({}, row);
      this.userFormVisible = true;
      this.rowIndex = index;
    },
    submitUser(formName) {
      // 表单验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let id = this.videoEdit.id;
          if (id) {
            // id非空-修改
            this.videos.splice(this.rowIndex, 1, this.videoEdit);
          } else {
            // id为空-新增
            this.videoEdit.id = this.videos.length + 1;
            this.videos.unshift(this.videoEdit);
          }
          this.userFormVisible = false;
          this.$message({
            type: "success",
            message: id ? "修改成功！" : "新增成功！",
          });
        }
      });
    },
    delVideo(e) {
      return Promise((resolve, reject) => {
        let ids = [e.id];
        this.http
          .post("/Admin/Home/DelVideo", {
            ids: ids,
          })
          .then((res) => {
            if (res.data.status) {
              resolve();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    handleDelete(e, s) {
      console.log(e);
      this.$confirm("确定删除该视频吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delVideo(s.id);
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
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

    handleRemove(file) {
      let arr = this.$refs.pictures.uploadFiles;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].url == file.url) {
          arr.splice(i, 1);
        }
      }
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
</style>
