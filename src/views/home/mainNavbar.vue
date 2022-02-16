<template>
  <div class="user-box">
    <el-row>
      <el-col :span="24">
        <div class="tool-box">
          <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="handleAdd">新增</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
        :data="videos"
        border
        @selection-change="selectChange"
        style="width: 100%">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="video"
          label="视频"
          >
      </el-table-column>
      <el-table-column
          prop="videoCover"
          label="视频封面"
          >
      </el-table-column>
      <el-table-column
          prop="videoTitle"
          label="视频标题">
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="primary"
              plain
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        background
        :page-sizes="[10, 20, 30, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
    </el-pagination>
    <el-dialog :title="dialogTitle" width="600px" :visible.sync="userFormVisible" @close="resetForm('userForm')">
      <el-form :model="videoEdit"  ref="userForm">
        <el-form-item label="视频上传" prop="name" label-width="100px">

<!--          <el-input v-model="videoEdit.video" autocomplete="off"></el-input>-->
        </el-form-item>
        <el-form-item label="封面上传" label-width="100px">
          <el-upload
              ref="pictures"
              action="#"
              list-type="picture-card"
              limit=1
              :auto-upload="false" >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url" alt=""
              >
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
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
<!--          <el-input v-model="videoEdit.videoCover" autocomplete="off"></el-input>-->
        </el-form-item>
        <el-form-item label="视频标题" label-width="100px">
          <el-input v-model="videoEdit.videoTitle" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser('userForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      videos: [{
        video: '2016-05-02',
        videoCover: '王小虎',
        videoTitle: '上海市普陀区金沙江路 1518 弄'
      }, {
        video: '2016-05-04',
        videoCover: '王小虎',
        videoTitle: '上海市普陀区金沙江路 1517 弄'
      }, {
        video: '2016-05-01',
        videoCover: '王小虎',
        videoTitle: '上海市普陀区金沙江路 1519 弄'
      }, {
        video: '2016-05-03',
        videoCover: '王小虎',
        videoTitle: '上海市普陀区金沙江路 1516 弄'
      }],
      videoEdit: {
        id: '',
        video: '',
        videoCover: '',
        videoTitle: '',
      },
      userBackup: Object.assign({}, this.user),
      multipleSelection: [],
      userFormVisible: false,
      dialogTitle: '',
      rowIndex: 9999,

      // 图片上传
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    }
  },
  mounted () {
    this.getUsers()
  },
  methods: {
    getUsers () {
      this.loading = true
      // this.$http('/api/users').then((res) => {
      //   this.users = res.data
      // }).catch((err) => {
      //   console.error(err)
      // })
    },
    handleEdit (index, row) {
      this.dialogTitle = '编辑'
      this.videoEdit = Object.assign({}, row)
      this.userFormVisible = true
      this.rowIndex = index
    },
    submitUser (formName) {
      // 表单验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let id = this.videoEdit.id
          if (id) {
            // id非空-修改
            this.videos.splice(this.rowIndex, 1, this.videoEdit)
          } else {
            // id为空-新增
            this.videoEdit.id = this.videos.length + 1
            this.videos.unshift(this.videoEdit)
          }
          this.userFormVisible = false
          this.$message({
            type: 'success',
            message: id ? '修改成功！' : '新增成功！'
          })
        }
      })
    },
    handleDelete (index,) {
      this.$confirm("确定删除该条信息吗?", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.videos.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        console.log('取消删除')
      })
    },
    resetForm (formName) {
      this.$refs[formName].clearValidate()
    },

    mulDelete () {
      let len = this.multipleSelection.length
      if (len === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一项！'
        })
      } else {
        this.$confirm(`确定删除选中的 ${len} 个用户吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: `成功删除了${len}条数据！`
          })
        }).catch(() => {
          console.log('取消删除')
        })
      }
    },
    selectChange (val) {
      this.multipleSelection = val
    },
    // 新增
    handleAdd () {
      this.dialogTitle = '新增'
      this.videoEdit = Object.assign({}, this.userBackup)
      this.userFormVisible = true
    },

    handleRemove(file) {
      let arr = this.$refs.pictures.uploadFiles;
      for(let i=0; i< arr.length; i++){
        if (arr[i].url == file.url){
          arr.splice(i,1)
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    }
  }
}
</script>

<style scoped>
.user-box {
  width: 100%;
}
.tool-box {
  padding: 10px 10px;
  border-bottom: 1px solid #eee;
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
  border-color: #409EFF;
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
