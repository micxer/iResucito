var fs=require('fs'),path=require('path'),Dropbox=require('dropbox').Dropbox,fetch=require('node-fetch');var dataPath=path.resolve(process.cwd(),'../data');var pars=process.argv.slice(2);var action=pars[0];if(action=='down'){console.log('Downloading to',dataPath);var dbx=new Dropbox({fetch:fetch,accessToken:process.env.DROPBOX_PASSWORD});dbx.filesListFolder({path:''}).then(function(files){if(files.entries.length){console.log("Downloading "+files.entries.length+" files...");}return Promise.all(files.entries.map(function(entry){return dbx.filesDownload({path:entry.path_lower}).then(function(meta){console.log("Saving "+meta.name);return fs.promises.writeFile(path.join(dataPath,meta.name),meta.fileBinary);});})).then(function(){console.log('Done!');});}).catch(function(err){return console.log('Preparing Error',err);});}else if(action=='up'){var file=pars[1];if(!file){console.log('Missing parameter file name to upload');process.exit();}var fullpath=path.isAbsolute(file)?file:path.join(dataPath,file);var baseName=path.basename(fullpath);console.log('Uploading from',fullpath);var dbx=new Dropbox({fetch:fetch,accessToken:process.env.DROPBOX_PASSWORD});dbx.filesUpload({path:"/"+baseName,mode:{'.tag':'overwrite'},contents:fs.readFileSync(fullpath)}).then(function(meta){console.log("Uploaded "+meta.name);}).catch(function(err){return console.log('Uploading Error',err);});}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9zeW5jRGF0YS5qcyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJwYXRoIiwiRHJvcGJveCIsImZldGNoIiwiZGF0YVBhdGgiLCJyZXNvbHZlIiwicHJvY2VzcyIsImN3ZCIsInBhcnMiLCJhcmd2Iiwic2xpY2UiLCJhY3Rpb24iLCJjb25zb2xlIiwibG9nIiwiZGJ4IiwiYWNjZXNzVG9rZW4iLCJlbnYiLCJEUk9QQk9YX1BBU1NXT1JEIiwiZmlsZXNMaXN0Rm9sZGVyIiwidGhlbiIsImZpbGVzIiwiZW50cmllcyIsImxlbmd0aCIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJlbnRyeSIsImZpbGVzRG93bmxvYWQiLCJwYXRoX2xvd2VyIiwibWV0YSIsIm5hbWUiLCJwcm9taXNlcyIsIndyaXRlRmlsZSIsImpvaW4iLCJmaWxlQmluYXJ5IiwiY2F0Y2giLCJlcnIiLCJmaWxlIiwiZXhpdCIsImZ1bGxwYXRoIiwiaXNBYnNvbHV0ZSIsImJhc2VOYW1lIiwiYmFzZW5hbWUiLCJmaWxlc1VwbG9hZCIsIm1vZGUiLCJjb250ZW50cyIsInJlYWRGaWxlU3luYyJdLCJtYXBwaW5ncyI6IkFBQUEsR0FBSUEsQ0FBQUEsRUFBRSxDQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFoQixDQUNFQyxJQUFJLENBQUdELE9BQU8sQ0FBQyxNQUFELENBRGhCLENBRUVFLE9BQU8sQ0FBR0YsT0FBTyxDQUFDLFNBQUQsQ0FBUCxDQUFtQkUsT0FGL0IsQ0FHRUMsS0FBSyxDQUFHSCxPQUFPLENBQUMsWUFBRCxDQUhqQixDQUtBLEdBQU1JLENBQUFBLFFBQVEsQ0FBR0gsSUFBSSxDQUFDSSxPQUFMLENBQWFDLE9BQU8sQ0FBQ0MsR0FBUixFQUFiLENBQTRCLFNBQTVCLENBQWpCLENBRUEsR0FBTUMsQ0FBQUEsSUFBSSxDQUFHRixPQUFPLENBQUNHLElBQVIsQ0FBYUMsS0FBYixDQUFtQixDQUFuQixDQUFiLENBQ0EsR0FBTUMsQ0FBQUEsTUFBTSxDQUFHSCxJQUFJLENB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U0dLLEtBVEgsQ0FTUyxTQUFBQyxHQUFHLFFBQUl4QixDQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxpQkFBWixDQUErQnVCLEdBQS9CLENBQUosRUFUWixFQVVEIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGZzID0gcmVxdWlyZSgnZnMnKSxcbiAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKSxcbiAgRHJvcGJveCA9IHJlcXVpcmUoJ2Ryb3Bib3gnKS5Ecm9wYm94LFxuICBmZXRjaCA9IHJlcXVpcmUoJ25vZGUtZmV0Y2gnKTtcblxuY29uc3QgZGF0YVBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJy4uL2RhdGEnKTtcblxuY29uc3QgcGFycyA9IHByb2Nlc3MuYXJndi5zbGljZSgyKTtcbmNvbnN0IGFjdGlvbiA9IHBhcnNbMF07XG5pZiAoYWN0aW9uID09ICdkb3duJykge1xuICBjb25zb2xlLmxvZygnRG93bmxvYWRpbmcgdG8nLCBkYXRhUGF0aCk7XG4gIC8vIFBvcHVsYXRlIC9kYXRhIGZvbGRlciBmcm9tIERyb3BicHhcbiAgdmFyIGRieCA9IG5ldyBEcm9wYm94KHtcbiAgICBmZXRjaCxcbiAgICBhY2Nlc3NUb2tlbjogcHJvY2Vzcy5lbnYuRFJPUEJPWF9QQVNTV09SRFxuICB9KTtcbiAgZGJ4XG4gICAgLmZpbGVzTGlzdEZvbGRlcih7IHBhdGg6ICcnIH0pXG4gICAgLnRoZW4oZmlsZXMgPT4ge1xuICAgICAgaWYgKGZpbGVzLmVudHJpZXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBEb3dubG9hZGluZyAke2ZpbGVzLmVudHJpZXMubGVuZ3RofSBmaWxlcy4uLmApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICBmaWxlcy5lbnRyaWVzLm1hcChlbnRyeSA9PlxuICAgICAgICAgIGRieC5maWxlc0Rvd25sb2FkKHsgcGF0aDogZW50cnkucGF0aF9sb3dlciB9KS50aGVuKG1ldGEgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFNhdmluZyAke21ldGEubmFtZX1gKTtcbiAgICAgICAgICAgIHJldHVybiBmcy5wcm9taXNlcy53cml0ZUZpbGUoXG4gICAgICAgICAgICAgIHBhdGguam9pbihkYXRhUGF0aCwgbWV0YS5uYW1lKSxcbiAgICAgICAgICAgICAgbWV0YS5maWxlQmluYXJ5XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICAgICkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdEb25lIScpO1xuICAgICAgfSk7XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKCdQcmVwYXJpbmcgRXJyb3InLCBlcnIpKTtcbn0gZWxzZSBpZiAoYWN0aW9uID09ICd1cCcpIHtcbiAgY29uc3QgZmlsZSA9IHBhcnNbMV07XG4gIGlmICghZmlsZSkge1xuICAgIGNvbnNvbGUubG9nKCdNaXNzaW5nIHBhcmFtZXRlciBmaWxlIG5hbWUgdG8gdXBsb2FkJyk7XG4gICAgcHJvY2Vzcy5leGl0KCk7XG4gIH1cbiAgY29uc3QgZnVsbHBhdGggPSBwYXRoLmlzQWJzb2x1dGUoZmlsZSkgPyBmaWxlIDogcGF0aC5qb2luKGRhdGFQYXRoLCBmaWxlKTtcbiAgY29uc3QgYmFzZU5hbWUgPSBwYXRoLmJhc2VuYW1lKGZ1bGxwYXRoKTtcbiAgY29uc29sZS5sb2coJ1VwbG9hZGluZyBmcm9tJywgZnVsbHBhdGgpO1xuICAvLyBQb3B1bGF0ZSAvZGF0YSBmb2xkZXIgZnJvbSBEcm9wYnB4XG4gIHZhciBkYnggPSBuZXcgRHJvcGJveCh7XG4gICAgZmV0Y2gsXG4gICAgYWNjZXNzVG9rZW46IHByb2Nlc3MuZW52LkRST1BCT1hfUEFTU1dPUkRcbiAgfSk7XG4gIGRieFxuICAgIC5maWxlc1VwbG9hZCh7XG4gICAgICBwYXRoOiBgLyR7YmFzZU5hbWV9YCxcbiAgICAgIG1vZGU6IHsgJy50YWcnOiAnb3ZlcndyaXRlJyB9LFxuICAgICAgY29udGVudHM6IGZzLnJlYWRGaWxlU3luYyhmdWxscGF0aClcbiAgICB9KVxuICAgIC50aGVuKG1ldGEgPT4ge1xuICAgICAgY29uc29sZS5sb2coYFVwbG9hZGVkICR7bWV0YS5uYW1lfWApO1xuICAgIH0pXG4gICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZygnVXBsb2FkaW5nIEVycm9yJywgZXJyKSk7XG59XG4iXX0=