import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import { getWalletState } from "../../actions/wallet";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import classNames from "classnames";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { withStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import AccountCircle from "@material-ui/icons/AccountCircle";
import HomeIcon from "@material-ui/icons/Home";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Fab from "@material-ui/core/Fab";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import CssBaseline from "@material-ui/core/CssBaseline";

import {
  //Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { faDharmachakra } from "@fortawesome/free-solid-svg-icons";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import { faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { faTint } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faLongArrowAltRight } from "@fortawesome/free-solid-svg-icons";
import { faUniversity } from "@fortawesome/free-solid-svg-icons";
import { faGlobeAfrica } from "@fortawesome/free-solid-svg-icons";
import { faHandHolding } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

var HalfLogo = require("../../assets/fullv24.png");

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: "100%",
    display: "flex"
  },
  grow: {
    flexGrow: 1
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  },
  menuButton: {
    marginLeft: -90,
    marginRight: 20
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },

  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9 + 1
    }
  },
  paper: {
    background: "#dd4f05;"
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  },
  whiteColor: {
    color: "#fcf9fa"
    //"white"
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
});

export class Header extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      walletBalance: "",
      anchorEl: null,
      mobileMoreAnchorEl: null,
      open: false,
      planOpen: false
    };
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handlePlansDisplay = () => {
    this.setState(state => ({ planOpen: !state.planOpen }));
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    getWalletState: PropTypes.func.isRequired
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  callWalletState() {
    if (this.props.auth.isAuthenticated) {
      this.props.getWalletState();
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.walletDetails !== prevProps.walletDetails) {
      if (this.props.walletDetails.length === 1) {
        if (this.props.walletDetails[0]) {
          this.setState({
            walletBalance: this.props.walletDetails[0].balance
          });
        }
      }
    }
  }
  render() {
    const { isAuthenticated, user } = this.props.auth;

    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes, theme } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
        <Link style={{ textDecoration: "none" }} to="/myaccount">
          <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
        </Link>
      </Menu>
    );

    {
      /* const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMobileMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMobileMenuClose}>
          <IconButton style={{ outline: "0" }} color="inherit">
            <Badge badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Alerts</p>
        </MenuItem>
        <MenuItem onClick={this.handleMobileMenuClose}>
          <IconButton color="inherit">
            <Badge badgeContent={11} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );
    */
    }
    const authLinks = (
      <MuiThemeProvider>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            style={{
              backgroundColor: "#fcf9fa",
              textAlign: "center",
              color: "#070707"
            }}
            position="static"
            className={classNames(classes.appBar, {
              [classes.appBarShift]: this.state.open
            })}
          >
            <div className="container">
              <Toolbar disableGutters={!this.state.open}>
                <IconButton
                  className={classNames(classes.menuButton, {
                    [classes.hide]: this.state.open
                  })}
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={this.handleDrawerOpen}
                  style={{ outline: "none" }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  className={classes.title}
                  variant="h6"
                  color="inherit"
                  noWrap
                >
                  Vault24
                </Typography>

                <div className={classes.grow} />
                <div className={classes.sectionDesktop}>
                  <div>
                    <IconButton style={{ outline: "none" }} color="inherit">
                      <h5>
                        {" "}
                        <AccountBalanceWalletIcon /> ₦{this.state.walletBalance}
                      </h5>
                    </IconButton>
                  </div>
                  <IconButton style={{ outline: "none" }} color="inherit">
                    <Badge badgeContent={1} color="secondary">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                  <IconButton
                    aria-owns={isMenuOpen ? "material-appbar" : undefined}
                    aria-haspopup="true"
                    onClick={this.handleProfileMenuOpen}
                    color="inherit"
                    style={{ outline: "none" }}
                  >
                    <AccountCircle />
                  </IconButton>
                </div>

                <div className={classes.sectionMobile}>
                  <IconButton
                    className={classNames(classes.menuButton, {
                      [classes.hide]: this.state.open
                    })}
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={this.handleDrawerOpen}
                    style={{
                      outline: "none",
                      marginLeft: "0",
                      marginRight: "0"
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                </div>
              </Toolbar>
            </div>
          </AppBar>
          {renderMenu}
          {/* renderMobileMenu */}
          <Link style={{ color: "#dd4f05" }} to="/">
            <Fab
              className={classes.fab}
              color="default"
              style={{ position: "fixed", zIndex: "1", outline: "none" }}
            >
              {" "}
              <HomeIcon className="animated zoomInDown delay-2s app-link" />
            </Fab>
          </Link>

          <div>
            <Drawer
              variant="temporary"
              className={classNames(classes.drawer, {
                [classes.drawerOpen]: this.state.open,
                [classes.drawerClose]: !this.state.open
              })}
              classes={{
                paper: classNames(classes.paper, {
                  [classes.drawerOpen]: this.state.open,
                  [classes.drawerClose]: !this.state.open
                })
              }}
              open={this.state.open}
            >
              <div
                className={classes.toolbar}
                style={{ backgroundColor: "#fcf9fa" }}
              >
                <div>
                  <img className="logo" src={HalfLogo} width="120px" />
                </div>
                <IconButton
                  style={{ outline: "none" }}
                  onClick={this.handleDrawerClose}
                >
                  {theme.direction === "rtl" ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </IconButton>
              </div>
              <Divider />
              <div>
                <ClickAwayListener onClickAway={this.handleDrawerClose}>
                  <div>
                    <List>
                      <ListItem button onClick={this.handlePlansDisplay}>
                        <ListItemIcon style={{ color: "#fcf9fa" }}>
                          <FontAwesomeIcon size="lg" icon={faDharmachakra} />
                        </ListItemIcon>

                        <ListItemText
                          classes={{ primary: this.props.classes.whiteColor }}
                          primary="Plans"
                        />
                        {this.state.planOpen ? (
                          <ExpandLess style={{ color: "#fcf9fa" }} />
                        ) : (
                          <ExpandMore style={{ color: "#fcf9fa" }} />
                        )}
                      </ListItem>

                      <Collapse
                        in={this.state.planOpen}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          <Link
                            to="/vault/littledrops"
                            style={{ textDecoration: "none" }}
                            onClick={this.handleDrawerClose}
                          >
                            <ListItem button className={classes.nested}>
                              <ListItemIcon style={{ color: "#fcf9fa" }}>
                                <FontAwesomeIcon icon={faTint} />
                              </ListItemIcon>
                              <ListItemText
                                classes={{
                                  primary: this.props.classes.whiteColor
                                }}
                                inset
                                primary="Little drops"
                              />
                            </ListItem>
                          </Link>
                          <Link
                            to="/vault/rentplus"
                            style={{ textDecoration: "none" }}
                            onClick={this.handleDrawerClose}
                          >
                            <ListItem button className={classes.nested}>
                              <ListItemIcon style={{ color: "#fcf9fa" }}>
                                <FontAwesomeIcon icon={faKey} />
                              </ListItemIcon>
                              <ListItemText
                                classes={{
                                  primary: this.props.classes.whiteColor
                                }}
                                inset
                                primary="Rent Plus"
                              />
                            </ListItem>
                          </Link>
                          <Link
                            to="/vault/targets"
                            style={{ textDecoration: "none" }}
                            onClick={this.handleDrawerClose}
                          >
                            <ListItem button className={classes.nested}>
                              <ListItemIcon style={{ color: "#fcf9fa" }}>
                                <FontAwesomeIcon icon={faBullseye} />
                              </ListItemIcon>
                              <ListItemText
                                classes={{
                                  primary: this.props.classes.whiteColor
                                }}
                                inset
                                primary="Target Savings"
                              />
                            </ListItem>
                          </Link>
                          <Link
                            to="/vault/fixed"
                            style={{ textDecoration: "none" }}
                            onClick={this.handleDrawerClose}
                          >
                            <ListItem button className={classes.nested}>
                              <ListItemIcon style={{ color: "#fcf9fa" }}>
                                <FontAwesomeIcon icon={faShieldAlt} />
                              </ListItemIcon>
                              <ListItemText
                                classes={{
                                  primary: this.props.classes.whiteColor
                                }}
                                inset
                                primary="Fixed Deposit"
                              />
                            </ListItem>
                          </Link>
                          <Link
                            to="/vault/kapital"
                            style={{ textDecoration: "none" }}
                            onClick={this.handleDrawerClose}
                          >
                            <ListItem button className={classes.nested}>
                              <ListItemIcon style={{ color: "#fcf9fa" }}>
                                <FontAwesomeIcon icon={faChartLine} />
                              </ListItemIcon>
                              <ListItemText
                                classes={{
                                  primary: this.props.classes.whiteColor
                                }}
                                inset
                                primary="Kapital"
                              />
                            </ListItem>
                          </Link>
                        </List>
                      </Collapse>

                      <Link
                        to="/loan/home"
                        style={{ textDecoration: "none" }}
                        onClick={this.handleDrawerClose}
                      >
                        <ListItem button>
                          <ListItemIcon style={{ color: "#fcf9fa" }}>
                            <FontAwesomeIcon size="lg" icon={faHandHolding} />
                          </ListItemIcon>

                          <ListItemText
                            classes={{ primary: this.props.classes.whiteColor }}
                            primary="Loans"
                          />
                        </ListItem>
                      </Link>
                      <Link
                        to="/deposit"
                        style={{ textDecoration: "none" }}
                        onClick={this.handleDrawerClose}
                      >
                        <ListItem button>
                          <ListItemIcon style={{ color: "#fcf9fa" }}>
                            <FontAwesomeIcon size="lg" icon={faUniversity} />
                          </ListItemIcon>

                          <ListItemText
                            classes={{ primary: this.props.classes.whiteColor }}
                            primary="Deposit"
                          />
                        </ListItem>
                      </Link>
                      <Link
                        to="/sendmoney"
                        style={{ textDecoration: "none" }}
                        onClick={this.handleDrawerClose}
                      >
                        <ListItem button>
                          <ListItemIcon style={{ color: "#fcf9fa" }}>
                            <FontAwesomeIcon size="lg" icon={faPaperPlane} />
                          </ListItemIcon>

                          <ListItemText
                            classes={{ primary: this.props.classes.whiteColor }}
                            primary="Send Money"
                          />
                        </ListItem>
                      </Link>
                      <Link
                        to="/withdraw"
                        style={{ textDecoration: "none" }}
                        onClick={this.handleDrawerClose}
                      >
                        <ListItem button>
                          <ListItemIcon style={{ color: "#fcf9fa" }}>
                            <FontAwesomeIcon
                              size="lg"
                              icon={faLongArrowAltRight}
                            />
                          </ListItemIcon>

                          <ListItemText
                            classes={{ primary: this.props.classes.whiteColor }}
                            primary="Withdraw"
                          />
                        </ListItem>
                      </Link>
                      <ListItem button>
                        <ListItemIcon style={{ color: "#fcf9fa" }}>
                          <Badge badgeContent={1} color="secondary">
                            <FontAwesomeIcon size="lg" icon={faBell} />
                          </Badge>
                        </ListItemIcon>

                        <ListItemText
                          classes={{ primary: this.props.classes.whiteColor }}
                          primary="Notifications"
                        />
                      </ListItem>
                      <Link
                        to="/vault/managecards"
                        style={{ textDecoration: "none" }}
                        onClick={this.handleDrawerClose}
                      >
                        <ListItem button>
                          <ListItemIcon style={{ color: "#fcf9fa" }}>
                            <FontAwesomeIcon size="lg" icon={faCreditCard} />
                          </ListItemIcon>

                          <ListItemText
                            classes={{ primary: this.props.classes.whiteColor }}
                            primary="Manage Cards"
                          />
                        </ListItem>
                      </Link>
                      <ListItem button>
                        <ListItemIcon style={{ color: "#fcf9fa" }}>
                          <FontAwesomeIcon size="lg" icon={faBullhorn} />
                        </ListItemIcon>

                        <ListItemText
                          classes={{ primary: this.props.classes.whiteColor }}
                          primary="Refer a friend"
                        />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon style={{ color: "#fcf9fa" }}>
                          <FontAwesomeIcon size="lg" icon={faComments} />
                        </ListItemIcon>

                        <ListItemText
                          classes={{ primary: this.props.classes.whiteColor }}
                          primary="Contact us"
                        />
                      </ListItem>
                      <ListItem button onClick={this.props.logout}>
                        <ListItemIcon style={{ color: "#fcf9fa" }}>
                          <FontAwesomeIcon size="lg" icon={faPowerOff} />
                        </ListItemIcon>

                        <ListItemText
                          classes={{ primary: this.props.classes.whiteColor }}
                          primary="Log out"
                        />
                      </ListItem>
                    </List>
                    <footer style={{ color: "#fcf9fa" }}>
                      v1.0.0 Powered by Addosser
                    </footer>
                  </div>
                </ClickAwayListener>
              </div>
            </Drawer>
          </div>
        </div>
      </MuiThemeProvider>
    );

    return (
      <div>
        {isAuthenticated ? authLinks : ""}
        {isAuthenticated ? this.callWalletState() : ""}
        <br />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  walletDetails: state.wallet.wallet[0]
});

export default connect(
  mapStateToProps,
  { logout, getWalletState }
)(withStyles(styles, { withTheme: true })(Header));
