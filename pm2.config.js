module.exports = {
  apps: [
      { 
          name: 'Farm Assist',
          script: './build/server.js',
          watch: ["./"],
          ignore_watch : ["node_modules"],
      },
  ],
};