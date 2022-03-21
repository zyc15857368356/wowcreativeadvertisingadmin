<template>
  <div class="container">
    <div>
      <el-input
        size="mini"
        style="width: 150px"
        placeholder="请输入关键字"
        v-model="search"
      ></el-input>
      <el-button size="mini" type="primary" style="margin-left: 10px"
        >查询</el-button
      >
      <el-button size="small" @click="reset" type="primary">重 置</el-button>
    </div>
    <div class="btns">
      <el-button type="primary" size="mini" @click="addType"> 新 增 </el-button>
      <el-button type="danger" size="mini" @click="delType"> 删 除 </el-button>
    </div>
    <div class="table">
      <el-table
        :data="data"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="Name" label="类型"> </el-table-column>
        <el-table-column prop="vidercou" label="数量"> </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.row)"
              >编 辑</el-button
            >
            <el-button type="danger" size="mini" @click="del(scope.row)"
              >删 除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose"
    >
      <div>
        <el-form inline>
          <el-form-item label="类型名称">
            <el-input
              size="mini"
              v-model="form.Name"
              placeholder="请输入类型名称"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删 除" :visible.sync="dialogVisible1" width="30%">
      <span>是否确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel1" size="mini">取 消</el-button>
        <el-button type="primary" @click="submit1" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      Id: null,
      title: "新 增",
      search: "",
      data: [],
      dialogVisible: false,
      dialogVisible1: false,
      form: { Name: "" },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      ids: [],
      isSingle: true,
      selectionList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.http
        .get("/Admin/Home/GetVideoType", { Role: 1, search: this.search })
        .then((res) => {
          console.log(res);
          if (res.data.Success) {
            this.data = res.data.Data;
          }
        })
        .catch((res) => {
          this.$message({
            message: res.data.Message,
            type: "error",
          });
        });
    },
    edit(e) {
      this.Id = e.Id;
      this.title = "编 辑";
      this.form.Name = e.Name;
      this.dialogVisible = true;
      console.log(e);
    },
    del(e) {
      this.Id = e.Id;
      this.isSingle = true;
      this.dialogVisible1 = true;
    },
    addType() {
      this.title = "新 增";
      this.dialogVisible = true;
    },
    delType() {
      if (this.selectionList.length <= 0) {
        return this.$message({
          message: "请至少选择一项！",
          type: "warning",
        });
      } else {
        this.isSingle = false;
        this.dialogVisible1 = true;
      }
    },
    handleClose() {},
    cancel() {
      this.dialogVisible = false;
      this.init();
    },
    init() {
      this.form = {
        Name: "",
      };
      this.Id = null;
      this.isSingle = true;
      this.title = "新增";
    },
    submit() {
      if (this.form.Name === "") {
        return this.$message({
          message: "类型名称不能为空",
          type: "error",
        });
      }
      if (this.title === "新 增") {
        this.http
          .post("/Admin/Home/AddVideoType", this.form)
          .then((res) => {
            if (res.data.Success) {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.init();
              this.dialogVisible = false;
              this.getList();
            }
          })
          .catch((res) => {
            this.$message({
              message: res.data.Message,
              type: "error",
            });
          });
      } else {
        this.form.Id = this.Id;
        this.http
          .post("/Admin/Home/EditVideoType", this.form)
          .then((res) => {
            if (res.data.Success) {
              this.$message({
                message: "编辑成功",
                type: "success",
              });
              this.init();
              this.dialogVisible = false;
              this.getList();
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
    cancel1() {
      this.dialogVisible1 = false;
      this.init();
    },
    submit1() {
      this.ids = [];
      if (this.isSingle) {
        this.ids = [this.Id];
      } else {
        this.selectionList.forEach((item) => {
          this.ids.push(item.Id);
        });
      }
      this.http
        .post("/Admin/Home/DelVideoType", this.ids)
        .then((res) => {
          if (res.data.Success) {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            this.dialogVisible1 = false;
            this.init();
            this.getList();
          }
        })
        .catch((res) => {
          this.$message({
            message: res.data.Message,
            type: "error",
          });
        });
    },
    handleSelectionChange(e) {
      this.selectionList = e;
    },
    reset() {
      this.search = "";
      this.getList;
    },
  },
};
</script>
<style scoped>
.btns {
  margin: 20px 0;
}
.table {
}
</style>