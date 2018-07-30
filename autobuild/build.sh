#!/bin/sh
echo "begin to organize files"

BASE_DIR=$(cd "$(dirname "$0")"; pwd)
echo $BASE_DIR

cd $BASE_DIR
cd ../
rm -rf output/
mkdir -p output/platform-fe/

#Modifed by zhaoxin3 2017-1-4
#rsync -av --delete --exclude "autobuild" --exclude "output" . ./output
cp -rp dist output/platform-fe
cp -rp img output/platform-fe
cp -rp font output/platform-fe
cp -rp ver output/platform-fe

#if [ x$1 = 'xtest' ]; then
# cp -rp Conf/test/*.php output/firsthouse-web/Conf/
# echo 'Copy Test Env File ok!'
#elif [ x$1 = 'xdev' ]; then
# cp -rp Conf/dev/*.php output/firsthouse-web/Conf/
# echo 'Copy dev Env File ok!'
#elif [ x$1 = 'xproducttest' ]; then
# cp -rp Conf/producttest/*.php output/firsthouse-web/Conf/
# echo 'Copy producttest Env File ok!'
#elif [ x$1 = 'xproduct' ] ; then
# cp -rp Conf/product/*.php output/firsthouse-web/Conf/
#echo 'Copy product Env File ok!'
 
#fi


#cd ..
echo "organize files success"