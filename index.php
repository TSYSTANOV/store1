<?php
error_reporting(E_ALL & ~E_WARNING & ~E_NOTICE);
require_once './utility/utility.php';
require_once './utility/validation.php';
require_once './utility/send_res.php';

$fileData = json_decode(file_get_contents('./data/data.json'), true);
$category = getCategory('category', $fileData);
$search = getSearch('search', $category);

if (!check_method('GET')) return false;
else if (!$search) return false;
else send_res(sortData($search));
// <?php

function send_res($data, $status=200) {
    http_response_code($status);
    header('Content-Type: application/json');
    print json_encode($data);
}
// <?php

function getParam($param) {
    if (isset($_GET[$param])) return trim($_GET[$param]);
    else return '';
}

function getCategory($param, $fileData) {
    $arr = explode(',', getParam($param));

    if ($arr[0] === '') return $fileData;
    else {
        $result = [];
        $arr = array_map('strtolower', $arr);
        $arr = array_map('trim', $arr);

        for ($i = 0; $i < count($fileData); $i++) {
            if (in_array(strtolower($fileData[$i]['category']), $arr)) {
                array_push($result, $fileData[$i]);
            }
        }
        if (empty($result)) {
            send_res(array('message' => 'no results found'));
            return false;
        }
        else return $result;
    }
}

function getSearch($param, $category) {
    $search = getParam($param);

    if ($search === '') return $category;
    else {
        $result = [];
        $search = strtolower($search);
        
        for ($i = 0; $i < count($category); $i++) {
            if (stripos($category[$i]['film'], $search) !== false
                || stripos($category[$i]['name'], $search) !== false) {
                array_push($result, $category[$i]);
            }
        }
        if (empty($result)) {
            send_res(array('message' => 'no results found'));
            return false;
        }
        else return $result;
    }
}

function sortData($search) {
    $sort = getParam('sort');

    if ($sort !== '') {
        if (substr($sort, 0, 1) === '-') {
            array_multisort(array_column($search, substr($sort, 1)), SORT_DESC, $search);
        } else {
            array_multisort(array_column($search, $sort), SORT_ASC, $search);
        }
    }
    return $search;
}
// <?php

function check_method($method) {
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        send_res(array('error' => 'incorrect method'), 405);
        return false;
    } else {
        return true;
    }
}