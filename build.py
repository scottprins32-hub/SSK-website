import glob,os,sys
here=os.path.dirname(os.path.abspath(__file__))
src=os.path.join(here,'src') if os.path.isdir(os.path.join(here,'src')) else here
out=sys.argv[1] if len(sys.argv)>1 else os.path.join(here,'concepts')
rd=lambda f:open(os.path.join(src,f),encoding='utf-8').read()
css,js=rd('base.css'),rd('data.js')+'\n'+rd('ui.js')
head=rd('head.html')
os.makedirs(out,exist_ok=True)
for f in sorted(glob.glob(os.path.join(src,'0*.html'))):
    page=open(f,encoding='utf-8').read()
    title,body=page.split('\n',1)
    html=head.replace('{{TITLE}}',title.strip()).replace('/*CSS*/',css)+body.replace('/*DATA*/',js)
    open(os.path.join(out,os.path.basename(f)),'w',encoding='utf-8').write(html)
    print('built',os.path.basename(f))
