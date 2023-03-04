# Name: fastifyrestapi
# port : 3002
# nodejs  Version node-v18.12.1
## Base URL
## http://localhost:3002/seminarapi/
## nodejs v 18.x.x
##  Author Kongnakorn Jantakun
##  email kongnakornna@gmail.com

# Use framework
```
- NodJS --> Fastify framework
- Typescript
- Typeorm mysql
- knextjs crud mysql
- Mysql
- Redis cache
- gulp-typescript
- nodemon
- Docker 
```
# How To run project
# install project
- Run `npm install`  or Run `npm i ` 

# task kill on Windows10 OS
- Run `netstat -an taskkill /f /im node.exe`  
# Development server
- Run `npx nodemon` for a dev server.  OR  Run `npx ts-node -P tsconfig.json src/server.ts `

## Development server on Build
# Build Source Code on production
- Run `npx gulp`
 -- After Run `npx gulp` is have directory `dist` file in package typescript
# directory Build file ` dist/server.ts`
# How To run project
# install project
- Run `npm install`  and  Run `npm install -g nodemon`

# Build Source Code on production
- Run `npx gulp`

# audit vulnerabilities 
- Run `npm audit` #Check audit information of installed dependencies showing 
- Run `npm audit fix --force`
- Run `npm audit --json `#Show audit results more detailed with json format
- Run `npm audit fix` #Audit and tries fixing vulnerabilities in dependencies
- Run `npm audit fix `--focce #Forces fix of problems found in installed packages
# installing further `dependencies if necessary

## Database
Database as MySQL  

## AI Assistant
```
# https://www.npmjs.com/package/virtual-assistant
# https://www.npmjs.com/package/virtual-google-assistant
# https://xekhai.medium.com/get-chatty-with-your-own-ai-assistant-a-guide-to-building-with-node-js-express-and-openai-6029ab6e6f7d

```
### MVP (Minimum Viable Product)
###  System analysis and design system basic api workflow
###  Concept
###  Features and system workflow
```
 1. Authentication API (Modules Authentication )
  - 1.0 Register or sign up or  Verify API-KEY to Create token 
  - 1.1 Create token or sign in or Verify by API-KEY to Create token 
  - 1.2 Verify token
  - 1.3 Private permission by token checking
  - 1.4 Access or allow to modules in function on api
  - 1.5 Validate Input data before access function and modules
  - 1.6 Cache management api

 2. User Management (Modules User )
 - 2.1 Update User Profile
 - 2.2 Access User permission level
 - 2.3 Delete User data Form Database

 3. Seminar Management (Modules Seminar )
 - 3.1  create new seminar  event or title. save to the database
 - 3.2  create detail list seminar event. save to the database
 - 3.3  create seminar period  save to the database
 - 3.4  create new  narrator save to the database
 - 3.5  create new link the speaker to event form narrator
 - 3.6  upadte data place  the seminar located. 
 - 3.7  Register to seminar event
 - 3.8  Verify token after Register form user to active event
 - 3.9  Create  by token generate Create link to the visitor.
 - 3.10 Verify token form link to activator accept the invitation.
 - 3.11 Repornd Result data from database ,Show visitor data accept to seminar
 - 3.12 Repornd Result data,narrator,visitor, data users seminar 

 4. System Report (Modules Report )
 - 4.1 Report data,narrator,visitor, data users seminar 
 - 4.2 Report data seminar event have count title seminar,detail seminar,narrator,visitor, data users seminar
 
```
##  Task Process Develop
```
- 1. Design system basic api workflow
- 2. Develop Application  use workflow diagram
- 3. Test by Tester or UAT Test  follow up workflow diagram
- 4. Deploy on staging or UAT  
- 5. Deploy on Production
- 6. MA (Maintenance api)
- 7. Upgrad Api 
```
##  MVP ( Minimum Viable Product )
```
 -- Deliver work frequently and clearly divide various parts according to the order.
 -- User research Demo Version to user Test possible on products
 -- Competitive analysis
 -- How quickly you’ll be able to iterate on certain types of functionality when you receive user feedback
 -- The relative costs to implement the various user stories or epics
 -- Release a product to the market as quickly as possible
 -- Test an idea with real users before committing a large budget to the --product’s full development
 -- Learn what resonates with the company’s target market and what doesn’t
 ```

# Agile development

## The Development Team consists of professionals who do the work of delivering a potentially releasable Increment of “Done” 
```
-- product at the end of each Sprint. Only members of the Development --Team create the Increment.
-- Development Teams are structured and empowered by the organization to organize and manage their own work. The resulting
-- synergy optimizes the Development Team’s overall efficiency and effectiveness. (3-9 Members)
-- Development Teams have the following characteristics:
-- They are self-organizing. No one (not even the Scrum Master) tells the Development Team how to turn Product Backlog
-- into Increments of potentially releasable functionality;
-- Development Teams are cross-functional, with all of the skills as a team necessary to create a product Increment;
## Scrum recognizes no titles for Development Team members other than Developer, regardless of the work being
-- performed by the person; there are no exceptions to this rule;
## Scrum recognizes no sub-teams in the Development Team, regardless of particular domains that need to be addressed
-- like testing or business analysis; there are no exceptions to this rule; and,
## Individual Development Team members may have specialized skills and areas of focus, but
-- accountability belongs to the Development Team as a whole
 
## Development Teams The software development team consists of Product development specialists who will be able to deliver an increment of “finished” products at the end of each sprint.
Only members of the software development team can create an increment.
## Development Teams Set the structure and empower each other as a team. to determine their own way of working The result of working together to optimize, make the image
 
Overall, the software development team is most efficient and effective. The software development team must have the following characteristics:
• Self-administered team without anyone (not even the Scrum Master) telling the development team how to turn the Product Backlog into adding potentially published functionality.
• The development team works across functions. It has all the skills needed to create incremental products.
• Scrum does not recognize names for development team members other than Developer, regardless of the work performed by that person. There are no exceptions to this rule.
• Scrum does not recognize sub-teams in the development team. regardless of the specific domain to be managed, such as testing or business analytics. There are no exceptions to this rule.
• Individual development team members may have specific skills and areas of focus. But the responsibility lies with the development team as a whole.
```