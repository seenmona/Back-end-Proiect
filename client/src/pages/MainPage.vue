<template>
  <q-page class>
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>My points of interest</q-toolbar-title>
        <q-btn
          color="white"
          text-color="primary"
          label="Profile"
          @click="
            userEdit = false;
            profile = true;
          "
          style="margin-right:50px"
        />
        <q-btn
          color="white"
          text-color="black"
          label="Log out"
          @click="onLogout"
        />
      </q-toolbar>
    </q-header>
    <q-tabs
      v-model="tab"
      dense
      align="justify"
      class="bg-grey-2 text-primary shadow-2"
      :breakpoint="0"
    >
      <q-tab name="my" label="My points of interest" />
      <q-tab name="all" label="All points of interest" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="my">
        <q-table
          title="My points"
          :data="points"
          :filter="filter"
          :columns="columns"
          row-key="name"
          style="margin:50px"
        >
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                class="button"
                outline
                style="margin-right:20px"
                @click="editPoint(props.row)"
                round
                color="primary"
                icon="create"
              />
              <q-btn
                class="button"
                outline
                @click="removePoint(props.row)"
                round
                color="negative"
                icon="delete"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-satisfaction="props">
            <q-td :props="props">
              <q-icon size="lg" :name="props.row.satisfaction" />
            </q-td>
          </template>

          <template v-slot:top-left>
            <q-btn color="primary" label="ADD" outline @click="addPoint" />

            <q-space />
          </template>
        </q-table>
      </q-tab-panel>
      <q-tab-panel name="all">
        <q-table
          title="All points of interest"
          :data="allPoints"
          :filter="filter"
          :columns="columns.filter(item => item.name != 'actions')"
          row-key="name"
          style="margin:50px"
        >
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-satisfaction="props">
            <q-td :props="props">
              <q-icon size="lg" :name="props.row.satisfaction" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="card" style="width:60%">
      <q-card class="my-card full-width">
        <q-card-section class="row text-h5 ellipsis">
          <div class="col-3 text-grey" v-if="state === 'ADD'">Add point</div>
          <div class="col-3 text-grey" v-else>Edit point</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">City:</div>
            <q-input
              class="col-9"
              type="text"
              outlined
              v-model="selectedPoint.city"
              dense
              label="City"
            />
          </div>

          <div class="row q-mb-md">
            <div class="col-3 text-grey">Name:</div>
            <q-input
              class="col-9"
              type="text"
              outlined
              v-model="selectedPoint.name"
              dense
              label="Name"
            />
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Grade: {{ selectedPoint.grade }}</div>
            <div class="col-9">
              <q-slider
                outlined
                dense
                v-model="selectedPoint.grade"
                :min="0"
                :max="10"
              />
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Observation:</div>
            <q-input
              class="col-9"
              type="text"
              outlined
              v-model="selectedPoint.observation"
              dense
              label="Observation"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <q-card-actions align="around">
            <q-btn
              icon="place"
              outline
              color="primary"
              @click="executeAddPoint"
              v-if="state === 'ADD'"
              >Add</q-btn
            >
            <q-btn
              icon="place"
              outline
              color="primary"
              v-else
              @click="executeSavePoint"
              >Edit</q-btn
            >
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="profile" style="width:60%">
      <q-card class="my-card full-width">
        <q-card-section class="row text-h5 ellipsis">
          <div class="col-3 text-grey" style="width: 83%;">My profile</div>
          <div class="col-2" align="right">
            <q-btn
              color="primary"
              round
              outline
              icon="create"
              v-if="!userEdit"
              @click="
                userEdit = true;
                isPassword = false;
              "
            />
            <q-btn
              color="primary"
              round
              outline
              v-else
              icon="clear"
              @click="
                userEdit = false;
                isPassword = false;
              "
            />
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">First name:</div>
            <div class="col-9 text-dark" v-if="!userEdit">
              {{ user.firstName }}
            </div>
            <q-input
              v-else
              class="col-9"
              type="text"
              outlined
              v-model="user.firstName"
              dense
              label="First name"
            />
          </div>

          <div class="row q-mb-md">
            <div class="col-3 text-grey">Last name:</div>
            <div class="col-9 text-dark" v-if="!userEdit">
              {{ user.lastName }}
            </div>
            <q-input
              v-else
              class="col-9"
              type="text"
              outlined
              v-model="user.lastName"
              dense
              label="Last name"
            />
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Email:</div>
            <div class="col-9 text-dark" v-if="!userEdit">{{ user.email }}</div>
            <q-input
              class="col-9"
              type="text"
              v-else
              outlined
              v-model="user.email"
              dense
              label="Email"
            />
          </div>
          <div class="row q-mb-md" v-if="isPassword">
            <div class="col-3 text-grey">Password:</div>

            <q-input
              v-model="password"
              outlined
              label="Password"
              class="col-9"
              dense
              :type="isPwd ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
        </q-card-section>
        <q-card-section>
          <q-card-actions v-if="userEdit" align="around">
            <q-btn
              outline
              v-if="!isPassword"
              color="primary"
              @click="isPassword = true"
              >Change password</q-btn
            >
            <q-btn
              icon="clear"
              outline
              color="primary"
              v-else
              @click="isPassword = false"
              >Password</q-btn
            >
            <q-btn icon="save" outline color="primary" @click="executeSaveUser"
              >Save changes</q-btn
            >
          </q-card-actions>
          <q-card-actions v-else align="around">
            <q-btn outline color="negative" @click="deleteAccount()"
              >Delete account</q-btn
            >
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style></style>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      isPassword: false,
      isPwd: true,
      password: "",
      profile: false,
      user: {},
      userEdit: false,
      state: "VIEW",
      tab: "my",
      filter: "",
      card: false,
      selectedPoint: {},
      columns: [
        {
          name: "city",
          required: true,
          label: "City",
          align: "left",
          field: row => row.city,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "grade",
          required: true,
          label: "Grade",
          align: "left",
          field: row => row.grade,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "observation",
          required: true,
          label: "Observations",
          align: "left",
          field: row => row.observation,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "actions",
          label: "Action"
        }
      ]
    };
  },
  beforeMount() {
    this.user = this.$q.localStorage.getItem("user");
    if (!this.user) {
      this.$router.push("/auth");
    } else {
      this.$store.dispatch("data/loadPoints");
      this.$store.dispatch("data/loadAllPoints");
    }
  },
  methods: {
    addPoint() {
      this.state = "ADD";
      this.card = true;
      this.selectedPoint = {
        city: "",
        name: "",
        grade: 5,
        observation: ""
      };
    },
    editPoint(point) {
      this.state = "EDIT";
      this.card = true;
      this.selectedPoint = {
        ...point
      };
    },
    deleteAccount() {
      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure you want to delete your account?`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$axios
            .delete("/api/user")
            .then(response => {
              this.$q.notify({
                color: "green",

                message: response.data.message,
                icon: "arrow_forward"
              });
              this.$q.localStorage.set("user", false);
              this.$router.push("/auth");
            })
            .catch(error => {
              switch (error.response.status) {
                case 400: {
                  error.response.data.errors.forEach(element => {
                    this.$q.notify({
                      color: "negative",
                      message: element
                    });
                  });
                  break;
                }
                default: {
                  this.$q.notify({
                    color: "negative",
                    message: error.response.data.message
                  });
                }
              }
            });
        });
    },
    removePoint(point) {
      this.$q
        .dialog({
          title: "Confirmation",
          message: `Do you want to delete ${point.name} from  ${point.city} ?`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$axios
            .delete("/api/points", {
              data: { id: point.id }
            })
            .then(response => {
              this.$q.notify({
                color: "green",

                message: response.data.message,
                icon: "arrow_forward"
              });
              this.$store.dispatch("data/loadPoints");
              this.$store.dispatch("data/loadAllPoints");
            })
            .catch(error => {
              switch (error.response.status) {
                case 400: {
                  error.response.data.errors.forEach(element => {
                    this.$q.notify({
                      color: "negative",
                      message: element
                    });
                  });
                  break;
                }
                default: {
                  this.$q.notify({
                    color: "negative",
                    message: error.response.data.message
                  });
                }
              }
            });
        });
    },
    executeSavePoint() {
      this.$axios
        .put("/api/points", {
          ...this.selectedPoint
        })
        .then(response => {
          this.$q.notify({
            color: "green",

            message: response.data.message,
            icon: "arrow_forward"
          });
          this.$store.dispatch("data/loadPoints");
          this.$store.dispatch("data/loadAllPoints");
          this.card = false;
        })
        .catch(error => {
          switch (error.response.status) {
            case 400: {
              error.response.data.errors.forEach(element => {
                this.$q.notify({
                  color: "negative",
                  message: element
                });
              });
              break;
            }
            default: {
              this.$q.notify({
                color: "negative",
                message: error.response.data.message
              });
            }
          }
        });
    },

    executeSaveUser() {
      this.$axios
        .put("/api/user", {
          ...this.user,
          password: this.password,
          changePassword: this.isPassword
        })
        .then(response => {
          this.$q.notify({
            color: "green",

            message: response.data.message,
            icon: "arrow_forward"
          });
          this.$q.localStorage.set("user", response.data.user);
          this.user = response.data.user;
          this.userEdit = false;
          this.isPassword = false;
        })
        .catch(error => {
          switch (error.response.status) {
            case 400: {
              error.response.data.errors.forEach(element => {
                this.$q.notify({
                  color: "negative",
                  message: element
                });
              });
              break;
            }
            default: {
              this.$q.notify({
                color: "negative",
                message: error.response.data.message
              });
            }
          }
        });
    },

    executeAddPoint() {
      this.$axios
        .post("/api/points", {
          ...this.selectedPoint
        })
        .then(response => {
          this.$q.notify({
            color: "green",

            message: response.data.message,
            icon: "arrow_forward"
          });
          this.$store.dispatch("data/loadPoints");
          this.$store.dispatch("data/loadAllPoints");
          this.card = false;
        })
        .catch(error => {
          switch (error.response.status) {
            case 400: {
              error.response.data.errors.forEach(element => {
                this.$q.notify({
                  color: "negative",
                  message: element
                });
              });
              break;
            }
            default: {
              this.$q.notify({
                color: "negative",
                message: error.response.data.message
              });
            }
          }
        });
    },
    onLogout() {
      this.$axios
        .get("/api/logout")
        .then(response => {
          this.$q.notify({
            color: "primary",
            message: response.data.message
          });

          this.$q.localStorage.set("user", false);
          this.$router.push("/auth");
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",
            message: error.response.data.message
          });
        });
    }
  },
  computed: {
    points() {
      return this.$store.getters["data/getPoints"];
    },
    allPoints() {
      return this.$store.getters["data/getAllPoints"];
    }
  }
};
</script>
