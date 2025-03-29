import Component from "@ember/component";
import { ajax } from "discourse/lib/ajax";
import { withPluginApi } from "discourse/lib/plugin-api";
import { computed } from "@ember/object";
import { htmlSafe } from "@ember/template";

export default Component.extend({
  classNames: ["featured-tiles"],
  featuredTiles: null,
  loading: true,
  error: false,

  init() {
    this._super(...arguments);
    this.set("featuredTiles", []);
    this.loadFeaturedTiles();
  },

  @computed("settings.tiles_count")
  tilesCount(settingCount) {
    return settingCount || 6;
  },

  @computed("settings.tiles_style")
  tilesStyle(style) {
    return style || "basic";
  },

  @computed("settings.tiles_grid_style")
  tilesGridStyle(style) {
    return style || "grid";
  },

  @computed("settings.tiles_grid_gap")
  tilesGridGap(gap) {
    return gap || "1em";
  },

  @computed("settings.tiles_grid_columns")
  tilesGridColumns(columns) {
    return columns || 3;
  },

  @computed("settings.tiles_grid_columns_mobile")
  tilesGridColumnsMobile(columns) {
    return columns || 1;
  },

  @computed("settings.tiles_grid_columns_tablet")
  tilesGridColumnsTablet(columns) {
    return columns || 2;
  },

  @computed("settings.tiles_height")
  tilesHeight(height) {
    return height || "200px";
  },

  @computed("settings.tiles_height_mobile")
  tilesHeightMobile(height) {
    return height || "200px";
  },

  @computed("settings.tiles_height_tablet")
  tilesHeightTablet(height) {
    return height || "200px";
  },

  @computed("settings.tiles_grid_columns", "settings.tiles_grid_columns_mobile", "settings.tiles_grid_columns_tablet", "settings.tiles_grid_gap", "settings.tiles_height", "settings.tiles_height_mobile", "settings.tiles_height_tablet")
  tilesGridStyles(columns, columnsMobile, columnsTablet, gap, height, heightMobile, heightTablet) {
    return htmlSafe(`
      --tiles-grid-columns: ${columns};
      --tiles-grid-columns-mobile: ${columnsMobile};
      --tiles-grid-columns-tablet: ${columnsTablet};
      --tiles-grid-gap: ${gap};
      --tiles-height: ${height};
      --tiles-height-mobile: ${heightMobile};
      --tiles-height-tablet: ${heightTablet};
    `);
  },

  loadFeaturedTiles() {
    this.set("loading", true);
    this.set("error", false);

    ajax(`/featured-tiles/featured.json?count=${this.tilesCount}`)
      .then((result) => {
        // Filter out topics from category 20 and topics without images
        const filteredTopics = result.topics.filter(topic => {
          // Skip topics from category 20
          if (topic.category_id === 20) {
            return false;
          }
          
          // Skip topics without images
          if (!topic.image_url) {
            return false;
          }
          
          return true;
        });
        
        this.set("featuredTiles", filteredTopics);
      })
      .catch((error) => {
        console.error("Error loading featured tiles:", error);
        this.set("error", true);
      })
      .finally(() => {
        this.set("loading", false);
      });
  },
});
