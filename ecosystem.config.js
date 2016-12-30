module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
    apps : [

        // First application
        {
            name      : 'node-comment',
            script    : 'index.js',
            env: {
                COMMON_VARIABLE: 'true'
            },
            env_production : {
                NODE_ENV: 'production'
            }
        },
    ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
    deploy : {
        production : {
            user : 'work',
            host : '60.205.141.126',
            ref  : 'origin/master',
            repo : 'git@github.com:xxmyjk/node-comment.git',
            path : '/mnt/deploy_root/producction',
            'post-deploy' : '/home/work/.nvm/versions/node/v6.9.1/bin/npm install && /home/work/.nvm/versions/node/v6.9.1/bin/pm2 startOrRestart ecosystem.json --env production'
        },
        dev : {
            user : 'work',
            host : '60.205.141.126',
            ref  : 'origin/master',
            repo : 'git@github.com:xxmyjk/node-comment.git',
            path : '/mnt/deploy_root/development',
            'post-deploy' : '/home/work/.nvm/versions/node/v6.9.1/bin/npm install && /home/work/.nvm/versions/node/v6.9.1/bin/pm2 startOrRestart ecosystem.json --env production',
            env  : {
                NODE_ENV: 'dev'
            }
        }
    }
};
