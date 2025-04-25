# KCover

It is known that the amount of data
generated has been increasing ly tremendous in the past few years due to
Covid 19 pandemic, the ease of access ing the internet and cheap or i nexpensive mass storage devices. T he ease
of transferring data through internet, communication lines and digital data are used in all walk s of life.
Nowadays, these big data have been used for data mining, knowledge discovery, machine learning, statis tical
learning, statistical analysis and experiments. In order to extract or discover useful data, information or
knowledge from these big data, one of the methods we usually adopt ed is the optimal samples selection .
In this group
project, you are expected to ex tract a subset of samples from these big data. In order to extract this
subset of data (samples), we have to make sure that the subset of samples extracted or selected should be as fair
and unbiased as possible and also as optimal as possible . In the follo wing we propose a useful method.
Assuming that
there are m samples ( 45  m  54 ), any group of n 7  n  25 ) samples out of these m samples are
randomly selected. There are m C n groups of n samples. From one of these groups of n samples, we randomly
select e.g. g., k =6 4  k  7 samples to form some group s . So there will be n C k groups of k =6 samples selected.
Among these groups of k =6 samples , we would like to optimize them by selecting ONLY some of them. The
conditions that need to be fulfilled are listed as follow s:
1. There are at least O NE group of k sample s , in which s 3  s  7 samples have been selected from the j
(where s  j  k samples , i.e., when j =4 , we have s=3 or 4 ; when j =5 , we have s=3 , 4 or 5 ; when j =6 , we
have s=3, 4, 5 or 6 ; an d when j =7 , we have s=3, 4, 5 , 6 or 7
E
. 1 , when m=45 , n=7 we randomly choose 7 samples, A,B,C,D,E,F,G and k=6, j=5, s=5 we obtain the
following minimum 6 groups of k =6 samples , which guarantee at least ONE group of k =6 sample s has ALL
s=5 samples groups from ALL j =5 sa mple s groups of n=7 samples,samples,(i. n C j 7 C 5 and j C s 5 C 5
1. A,B,C,D,E,G 2. A,B,C,D,F,G 3. A,B,C,E,F,G
4. A,B,D,E,F,G, 5. A,C,D,E,F,G 6. B,C,D,E,F,G
E
. 2, when m=45, n= 8 we randomly choose 8 samples, A,B,C,D,E,F,G ,H and k=6, j=4, s=4 we obtain
the following minimum 7 groups of k=6 samples, which guarantee s at least ONE group of k =6 samples has
ALL s= 4 samples groups from ALL j=4 s amples groups of n=8 samples, (i. n C j 8 C 4 and j C s 4 C 4
1. A,B,C,D,G,H 2. A,B,C,E,G,H 3. A,B,C,F,G ,H
4. A,B,D,E,F,G 5. A,C,D,E,F,H 6. B,C,D,E,F,H 7. C,D,E,F,G,H
E
. 3, when m=45, n=9 we randomly choose 9 samples, A,B,C,D,E,F,G,H,I and k=6, j=4, s=4 we obtain
the following minimum 12 groups of k=6 samples, which guarantee s at least ONE group of k =6 samples
has ALL s= 4 samples groups from ALL j=4 samples groups of n=9 samples, (i. n C j 9 C 4 and 4 C 4
1. A,B,C,D,E,I 2. A,B,C,E,G,H 3. A,B,C,F,H,I 4. A,B,D,E,F,G
5.
A,B,D,G,H,I. 6. A,C,D,E,F,H 7. A,C,D,F,G,I 8. A,E,F,G,H,I
9.
B,C,D, F,G,H 10. B,C,E,F,G,I 11. B,D,E,F,H,I 12. C,D,E,G,H,I
E
.g.4 , when m=45, n=8 we randomly choose 8 samples, A,B,C,D,E,F,G,H and k=6, j=6, s=5 we obtain
the following minimum 4 groups of k=6 samples, which guarantee s at least ONE group of k 6 samples has
at least ONE s= 5 samples group from ALL j=6 samples groups of n=8 samples, (i. n C j 8 C 6 and 6 C 5
1. A,B,C,E G,H 2. A,B,D,F,G,H 3. A,C,D,E,F,H 4. B,C ,D,E,F,G
E
E.g..g. 55, when , when m=45, n=m=45, n=88 (we randomly choose (we randomly choose 88 samples, samples, A,B,C,D,E,F,G,HA,B,C,D,E,F,G,H and and k=6, j=k=6, j=66, s=, s=55,, we obtain we obtain the following minimum the following minimum 1100 groups of groups of k=6k=6 samples, which guarantees at least ONE group of samples, which guarantees at least ONE group of k=6k=6 samples samples has has at least FOURat least FOUR s=s=55 samples groups from ALL samples groups from ALL j=j=66 samples groupssamples groups of of n=9 n=9 samples, (i.e.,samples, (i.e., nnCCjj==88CC66 and and 66CC55).).
1.1. A,B,C,D,E,A,B,C,D,E,HH 2.2. A,B,C,E,A,B,C,E,FF,H,H 3.3. A,B,C,A,B,C,EE,,G,HG,H 4.4. A,B,D,E,F,GA,B,D,E,F,G
5.
5. A,B,D,A,B,D,FF,,G,G,HH.. 6.6. A,C,D,A,C,D,E,E,F,F,GG 7.7. A,A,D,D,E,E,F,G,F,G,HH 8.8. B,CB,C,,D,D,E,E,G,HG,H
9.
9. B,C,D,F,G,HB,C,D,F,G,H 10.10. B,B,DD,E,F,G,,E,F,G,HH
E
E.g..g. 66, when , when m=45, n=9m=45, n=9 ((we we randomly choose randomly choose 99 samples, samples, A,B,C,D,E,F,G,H,I A,B,C,D,E,F,G,H,I and and k=6,k=6, jj=5,=5, s=4s=4,, we we obtain the following minimum obtain the following minimum 33 groups of groups of k=6k=6 samples, which samples, which guaranteeguarantees at least ONEs at least ONE group of group of kk=6=6 samples has samples has at least at least ONE ONE s=s=44 samples samples groupgroup from from ALL ALL j=5j=5 samples samples groups groups ofof n=9n=9 samples,samples, (i.e.,(i.e., nnCCjj==99CC5 5 and and 55CC44).).
1.1. A,A,B,D,F,G,HB,D,F,G,H 2.2. A,C,E,G,H,IA,C,E,G,H,I 3. 3. BB,C,D,E,F,I,C,D,E,F,I
E
E.g..g. 77, when , when m=45, n=10m=45, n=10 ((we we randomly chooserandomly choose 1010 samples, samples, A,B,C,D,E,F,G,H,I,J A,B,C,D,E,F,G,H,I,J and and k=6,k=6, j=6,j=6, s=4s=4,, we we obtain obtain the the following minimum following minimum 33 groups of groups of k=6k=6 samples, which samples, which guaranteeguarantees at least ONE group of s at least ONE group of kk=6=6 samples has samples has at least at least ONE ONE s=s=44 samples samples groupgroup ffrom rom ALL ALL j=6j=6 samples groupssamples groups of of n=10n=10 samplessamples,, (i.e., (i.e., 1010CC6 6 and and 66CC44).).
1.1. A,B,E,G,I,JA,B,E,G,I,J 2.2. A,C,E,G,H,JA,C,E,G,H,J 3.3. B,C,D,F,H,IB,C,D,F,H,I
E
E.g..g. 88, when , when m=45, n=12m=45, n=12 ((we we randomly chooserandomly choose 1212 samples, samples, A,B,C,D,E,F,G,H,I,J,K,L A,B,C,D,E,F,G,H,I,J,K,L and and k=6, k=6, j=6, j=6, s=4s=4,, we we obtain the following minimobtain the following minimum um 66 groups of groups of k=6k=6 samples, which samples, which guaranteeguarantees at least ONE group of s at least ONE group of kk=6=6 samples has samples has at least at least ONE ONE s=s=44 samples samples groupgroup from from ALL ALL j=6j=6 samples groups samples groups of of n=12n=12 samples.samples. (i.e.,(i.e., nnCCjj==1212CC6 6 andand jjCCss==66CC44).).
1.1. A,B,D,G,K,LA,B,D,G,K,L 2.2. A,C,D,H,J,LA,C,D,H,J,L 3.3. A,D,E,F,I,LA,D,E,F,I,L
4.
4. B,C,G,H,J,K.B,C,G,H,J,K. 5.5. B,E,FB,E,F,G,I,K,G,I,K 6.6. C,E,F,H,I,JC,E,F,H,I,J
2
2. . A user friendly interface should be provided. A user friendly interface should be provided. A system A system titletitle is givenis given asas, e.g, e.g.., , ““An Optimal SampleAn Optimal Sampless Selection SystemSelection System””. .
3
3. . The user needs toThe user needs to inputinput the the values for values for parameters parameters m, nm, n,, kk, j, j and and ss.. They are all positive integers.They are all positive integers. See SSee Screens below.creens below.
4
4. . The system The system can either can either randomly selectrandomly select nn out of out of mm numbers or a user numbers or a user can inputcan input nn out of out of mm numbersnumbers, , and displayand displayss these these n n numbernumberss on screenon screen..
5
5.. Output groups of Output groups of kk=6=6 samplessamples (results)(results) to a DB file, e.g., to a DB file, e.g., 4040--99--66--44--44--xx--yy for for m=40m=40, n=9, k=6, j=s=4, n=9, k=6, j=s=4 for for thethe xxthth runrun andand yy is is the the number of number of results obtainedresults obtained..
6
6. . Provide a wayProvide a way to to EXECUTE and EXECUTE and DELETEDELETE, etc., etc. the the obtained obtained groups of groups of kk samplessamples (results)(results) onto the screen fonto the screen fromrom aa DB file, e.g., DB file, e.g., 4545--99--66--44--44--xx--yy..These groups of These groups of kk=6=6 samples are selected from thesamples are selected from the list. Please see the screens below.list. Please see the screens below.
7
7. . Students are required to fStudents are required to foorm grouprm groupss yourselvesyourselves. Each group should. Each group should/must/must have have 44 students. students. No group of less than 4 No group of less than 4 students students is allowed unless under some specific condition, i.e., the total number of students not divisible by 4. is allowed unless under some specific condition, i.e., the total number of students not divisible by 4. You are You are advised to include advised to include in your in your groupgroup at least ONE studat least ONE student who knows how to do ent who knows how to do programmingprogramming in in any programming any programming languages.languages.
8
8.. Use numeral valuesUse numeral values, e.g., positive INTEGERS, 01,02,03,, e.g., positive INTEGERS, 01,02,03,……..,54 instead of..,54 instead of big big capitalcapital letters A,B,C,D,E,Fletters A,B,C,D,E,F…….,Z.,Z for the for the mm,, n,n, k, k, jj and and ss numbers. numbers.
9
9.. Submit Submit to me to me namenames s and student IDand student IDss of your of your group group membersmembers using using halfhalf of anof an A4 paper A4 paper nenext weekxt week.. Group numbers Group numbers will will be provided be provided to you to you later for presentationlater for presentation in weekin week 1313. .
10
10. . A A presentation and presentation and demonstration demonstration of your project of your project is a MUSTis a MUST in weekin weeks s 1414 and/orand/or 1515..
11
11. E. Each group is required to have a ach group is required to have a 15 15 minuteminutess presentationpresentation which includeswhich includes the the brief brief introductionintroduction, , detailed detailed descriptiondescription of of method(s) adoptedmethod(s) adopted/used/used, what , what you you have have been been achievedachieved in this projectin this project, , and and a a demonstration of your demonstration of your system system is a MUSTis a MUST in thein the presentation.presentation.
12
12.. A clear, A clear, susuccinctccinct, , easy to understand easy to understand detaileddetailed user manualuser manual/guide/guide on how toon how to INSTALL and INSTALL and EXECUTE EXECUTE your your DEVELOPEDDEVELOPED systemsystem step by stepstep by step andand a a project reportproject report must be submittedmust be submitted in hardcin hardcopyopy. The . The PROJECT PROJECT REPORTREPORT must includemust include methodmethod(s)/methodology(s)/methodology (supported by diagram(s)(supported by diagram(s), etc., etc.)), features y, features you ou have developedhave developed/used/used, , contributionscontributions such as good such as good runningrunning time, optimal/near optimal results, etc., and time, optimal/near optimal results, etc., and problems such as problems such as long time to long time to get results, results not good enough, etc.get results, results not good enough, etc. of your system, of your system, results of results of sample runssample runs,, etc. etc. shouldshould be submitted be submitted also also in in hardcopyhardcopy..
13
13. You are required to . You are required to submit a submit a USBUSB which containswhich contains your developed system, all your source filesyour developed system, all your source files (codes)(codes), , free/share free/share wareware, , databadatabase files, se files, DB files of DB files of kk=6=6 samplessamples ((sample runs sample runs outputsoutputs/results/results)),, and the and the REPORTREPORT mentioned in point 12mentioned in point 12..
14
14. . Bonuses will be gBonuses will be giiven to ven to group(s) group(s) thatthat allowallow users to select users to select as as many many different parametersdifferent parameters as possible foras possible for m,m, n,n, kk,, j j andand ss, , good good methodmethod(s) adopted(s) adopted, , could generate could generate optimaloptimal// near optimalnear optimal solutionssolutions. Furthermore, bonuses . Furthermore, bonuses will bewill be given to the given to the developed systemdeveloped system(s)(s) that that could be excould be executed in ecuted in aa short timeshort time and and run on run on a a mobile phonemobile phone..
15
15.. All teams must submit their projects All teams must submit their projects inin aa USBUSB and and hardcopyhardcopy of thof the e REPORTREPORTs (User Manual and Project Report)s (User Manual and Project Report) in in Week 1Week 155. . GroupGroup number, nnumber, namames, student numbers of your groupes, student numbers of your group membemembers should bers should be listed inlisted in your your User ManualUser Manual and and REPORTREPORT..