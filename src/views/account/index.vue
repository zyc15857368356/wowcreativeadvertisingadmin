<template>
  <div class="user-box">
    <el-table :data="data"
              border
              @selection-change="selectChange"
              style="width: 100%">
      <el-table-column type="selection"
                       width="55"> </el-table-column>
      <el-table-column prop="UserName"
                       label="用户名"> </el-table-column>
      <el-table-column prop="RealName"
                       label="真实姓名"> </el-table-column>
      <el-table-column prop="Role"
                       label="用户角色">
        <template slot-scope="scope">
          {{ scope.row.Role | roleFliter }}
        </template>
      </el-table-column>
      <el-table-column prop="Tel"
                       label="电话"> </el-table-column>
      <el-table-column prop="Portrait"
                       label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.Portrait"
               style="width: 30px; height: 30px"
               alt="" />
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       fixed="right"
                       width="240">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="primary"
                     plain
                     @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini"
                     type="primary"
                     @click="viewDetail(scope.$index, scope.row)">详情</el-button>
          <el-button size="mini"
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: flex-end">
      <el-pagination :current-page="page.page"
                     :page-sizes="[10, 20, 30, 50]"
                     :page-size="page.row"
                     @size-change="sizeChange"
                     @current-change="currentChange"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="page.total">
      </el-pagination>
    </div>
    <el-dialog :title="dialogTitle"
               width="600px"
               ref="detailForm"
               :visible.sync="userFormVisible"
               @close="resetForm('userForm')">
      <el-form label-width="100px">
        <el-form-item label="用户名">
          <el-input size="mini"
                    v-model="form.UserName"
                    style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input size="mini"
                    v-model="form.RealName"
                    style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input size="mini"
                    v-model="form.Tel"
                    style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.Role"
                     placeholder="请选择"
                     size="mini"
                     style="width: 200px">
            <el-option label="微信用户"
                       :value="0"></el-option>
            <el-option label="管理员"
                       :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面上传">
          <el-upload ref="pictures"
                     action="#"
                     class="avatar-uploader"
                     list-type="picture-card"
                     :http-request="uploadimg"
                     :limit="1">
            <img v-if="form.Portrait"
                 :src="form.Portrait"
                 class="avatar" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="userFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitUser()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="详情"
               width="800px"
               :visible.sync="detailVisible"
               :before-close="detailClose"
               :show-close="false">
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="收藏"
                     name="first">
          <el-table :data="collectionobj"
                    style="width: 100%">
            <el-table-column prop="Titel"
                             label="视频标题"
                             width="180">
            </el-table-column>
            <el-table-column prop="Price"
                             label="价格/元"
                             width="180">
            </el-table-column>
            <el-table-column prop="Link"
                             label="链接"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="分享"
                     name="second">
          <el-table :data="shareobj"
                    style="width: 100%">
            <el-table-column prop="Titel"
                             label="视频标题"
                             width="180">
            </el-table-column>
            <el-table-column prop="Price"
                             label="价格/元"
                             width="180">
            </el-table-column>
            <el-table-column prop="Link"
                             label="链接"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="点赞"
                     name="third">
          <el-table :data="thumobj"
                    style="width: 100%">
            <el-table-column prop="Titel"
                             label="视频标题"
                             width="180">
            </el-table-column>
            <el-table-column prop="Price"
                             label="价格/元"
                             width="180">
            </el-table-column>
            <el-table-column prop="Link"
                             label="链接"> </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer">
        <el-button size="mini"
                   @click="close"
                   type="primary">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      collectionobj: [],
      shareobj: [],
      thumobj: [],
      activeName: "first",
      detailVisible: false,
      MemberId: localStorage.getItem("MemberId"),
      Role: localStorage.getItem("Role"),
      fileList: [],
      data: [],
      form: {
        UserName: "",
        RealName: "",
        Tel: "",
        Portrait: "",
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
      imgUrl: "https://www.epoia.cn/Image/",
      fileUrl: "https://www.epoia.cn/Data/",
      id: null,
    };
  },
  mounted() {
    this.getData();
  },
  filters: {
    roleFliter(e) {
      var str = "";
      switch (e) {
        case 0:
          console.log(123);
          str = "微信用户";
          break;
        case 1:
          str = "管理员";
          break;
      }
      return str;
    },
  },
  methods: {
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
    handleClick() { },
    viewDetail(e, s) {
      this.http
        .get("/Admin/Home/GetBehavior", { id: s.Id })
        .then((res) => {
          if (res.data.Success) {
            this.collectionobj = res.data.Data.collectionobj.collectionvideo;
            this.shareobj = res.data.Data.shareobj.sharevideo;
            this.thumobj = res.data.Data.thumobj.thumbvideo;
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
    delVideo(e) {
      let ids = [e];
      this.http
        .post("/Admin/Home/DelUserInformation", ids)
        .then((res) => {
          if (res.data.Success) {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            this.getData();
          }
        })
        .catch((res) => {
          this.$message({
            message: res.data.Message,
            type: "error",
          });
        });
    },
    handleDelete(e, s) {
      this.$confirm("确定删除账号吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delVideo(s.Id);
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    uploadimg(e) {
      var formdata = new FormData();
      formdata.append("files", e.file);
      this.http
        .post("/Admin/Home/UploadImage", formdata)
        .then((res) => {
          if (res.data.Success) {
            this.form.Portrait = res.data.Data;
          }
        })
        .catch((res) => {
          this.$message({
            message: res.data.Message,
            type: "error",
          });
        });
    },
    currentChange(e) {
      this.page.page = e;
      this.getData();
    },
    sizeChange(e) {
      this.page.row = e;
      this.getData();
    },
    getData() {
      this.loading = true;
      this.http
        .get(
          "/Admin/Home/GetUserInformation?pageIndex=" +
          this.page.page +
          "&pageSize=" +
          this.page.row +
          "&search=" +
          this.search
        )
        .then((res) => {
          if (res.data.Success) {
            this.data = res.data.Data;
            this.page.total = res.data.Data.length
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
      this.form = {
        UserName: row.UserName,
        RealName: row.RealName,
        Tel: row.Tel,
        Portrait: row.Portrait,
        Role: row.Role,
      };
      this.userFormVisible = true;
    },
    submitUser() {
      for (let key in this.form) {
        if (!this.form[key]) {
          console.log(key);
          return this.$message({
            message: "请填写完整",
            type: "warning",
          });
        }
      }
      var obj = {
        UserName: this.form.UserName,
        RealName: this.form.RealName,
        Tel: this.form.Tel,
        Portrait: this.form.Portrait,
      };
      if (this.id) {
        obj.id = this.id;
        this.http
          .post("/Admin/Home/EditUserInformation", obj)
          .then((res) => {
            if (res.data.Success) {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.form = {
                UserName: this.form.UserName,
                RealName: this.form.RealName,
                Tel: this.form.Tel,
                Portrait: this.form.Portrait,
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
    selectChange(val) {
      this.multipleSelection = val;
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
